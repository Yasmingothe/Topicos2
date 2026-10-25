import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { voltar } from '../../../directives/voltar.directive';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Cliente, Estado } from '../../../models/cliente.model';
import { ErroApi } from '../../../models/erro-api.model';
import { AuthService } from '../../../services/auth.service';
import { CepService } from '../../../services/cep.service';
import { ClienteService } from '../../../services/cliente.service';
import { MinhaContaService } from '../../../services/minha-conta.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { corSituacao, cpf, data, soNumeros, telefone } from '../../../utils/formatar';
import {
  cpfValido, dataFutura, dataNascimentoValida, naoSomenteEspacos, telefoneValido,
} from '../../../utils/validadores';

@Component({
  selector: 'app-minha-conta',
  imports: [
    RouterLink, ReactiveFormsModule, MatTabsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
  ],
  templateUrl: './minha-conta.html',
  styleUrl: './minha-conta.css',
})
export class MinhaConta implements OnInit {

  private fb = inject(FormBuilder);
  private minhaConta = inject(MinhaContaService);
  private clienteService = inject(ClienteService);
  private cepService = inject(CepService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);
  private location = inject(Location);
  auth = inject(AuthService);

  aba = input<string>();    // ?aba=autorizacao abre direto a segunda aba
  voltar = input<string>(); // ?voltar=/checkout volta depois de salvar

  cliente = signal<Cliente | null>(null);
  estados = signal<Estado[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  enviandoAutorizacao = signal(false);
  buscandoCep = signal(false);
  avisoCep = signal('');
  abaAtual = signal(0);

  data = data;
  corSituacao = corSituacao;

  dados = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120), naoSomenteEspacos]],
    cpf: ['', [Validators.required, cpfValido]],
    dataNascimento: ['', [Validators.required, dataNascimentoValida]],
    telefone: ['', [Validators.required, telefoneValido]],
    cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
    logradouro: ['', [Validators.required, Validators.maxLength(120), naoSomenteEspacos]],
    numero: ['', [Validators.required, Validators.maxLength(10), naoSomenteEspacos]],
    complemento: ['', [Validators.maxLength(60)]],
    bairro: ['', [Validators.required, Validators.maxLength(80), naoSomenteEspacos]],
    cidade: ['', [Validators.required, Validators.maxLength(80), naoSomenteEspacos]],
    uf: ['', [Validators.required]],
  });

  autorizacao = this.fb.nonNullable.group({
    numero: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9./-]{5,30}$/)]],
    validade: ['', [Validators.required, dataFutura]],
  });

  podeEnviarAutorizacao = computed(() => this.cliente() !== null);

  ngOnInit(): void {
    if (this.aba() === 'autorizacao') this.abaAtual.set(1);
    this.clienteService.listarEstados().subscribe((lista) => this.estados.set(lista));

    this.minhaConta.meusDados().subscribe({
      next: (c) => {
        this.carregando.set(false);
        if (!c) {
          this.dados.patchValue({ nome: this.auth.usuario()?.nome ?? '' });
          return;
        }
        this.preencher(c);
      },
      error: () => this.carregando.set(false),
    });
  }

  private preencher(c: Cliente): void {
    this.cliente.set(c);
    this.dados.patchValue({
      nome: c.nome, cpf: cpf(c.cpf), dataNascimento: c.dataNascimento, telefone: telefone(c.telefone),
      cep: c.cep.replace(/(\d{5})(\d{3})/, '$1-$2'), logradouro: c.logradouro, numero: c.numero, complemento: c.complemento ?? '',
      bairro: c.bairro, cidade: c.municipio.nome, uf: c.municipio.estado.sigla,
    });
    if (c.numeroAutorizacao)
      this.autorizacao.patchValue({ numero: c.numeroAutorizacao, validade: c.validadeAutorizacao ?? '' });
  }

  buscarCep(): void {
    const controle = this.dados.controls.cep;
    if (controle.invalid) return;

    this.buscandoCep.set(true);
    this.avisoCep.set('');
    this.cepService.consultar(soNumeros(controle.value)).subscribe({
      next: (endereco) => {
        this.buscandoCep.set(false);
        if (!endereco) {
          this.avisoCep.set('CEP não encontrado. Preencha o endereço manualmente.');
          return;
        }
        this.dados.patchValue({
          logradouro: endereco.logradouro, bairro: endereco.bairro,
          cidade: endereco.localidade, uf: endereco.uf,
        });
      },
      error: () => {
        this.buscandoCep.set(false);
        this.avisoCep.set('Não foi possível consultar o CEP agora. Preencha manualmente.');
      },
    });
  }

  salvarDados(): void {
    if (this.dados.invalid) {
      this.dados.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    const v = this.dados.getRawValue();

    this.minhaConta.salvarDados({
      ...v,
      nome: v.nome.trim(),
      email: this.auth.usuario()?.email ?? '',
      cpf: soNumeros(v.cpf),
      telefone: soNumeros(v.telefone),
      cep: soNumeros(v.cep),
    }).subscribe({
      next: (c) => {
        this.preencher(c);
        this.auth.atualizarNome(c.nome);
        this.salvando.set(false);
        this.notificacao.sucesso('Dados salvos.');

        // veio do checkout pedindo autorização: fica aqui para mandar a autorização
        if (this.carrinhoPedeAutorizacao()) {
          this.abaAtual.set(1);
          return;
        }
        // senão, volta para onde a pessoa estava antes de abrir Minha conta
        if (this.voltar()?.startsWith('/')) this.router.navigateByUrl(this.voltar()!);
        else voltar(this.router, this.location, '/');
      },
      error: (erro: HttpErrorResponse) => {
        this.aplicarErros(erro, this.dados);
        this.salvando.set(false);
      },
    });
  }

  enviarAutorizacao(): void {
    if (this.autorizacao.invalid) {
      this.autorizacao.markAllAsTouched();
      return;
    }
    this.enviandoAutorizacao.set(true);
    const v = this.autorizacao.getRawValue();

    this.minhaConta.enviarAutorizacao({ numero: v.numero.trim(), validade: v.validade }).subscribe({
      next: (c) => {
        this.preencher(c);
        this.enviandoAutorizacao.set(false);
        this.notificacao.sucesso('Autorização enviada. A loja vai conferir e liberar.');
      },
      error: (erro: HttpErrorResponse) => {
        this.aplicarErros(erro, this.autorizacao);
        this.enviandoAutorizacao.set(false);
      },
    });
  }

  // se veio do checkout para mandar a autorização, não volta antes de mandar
  private carrinhoPedeAutorizacao(): boolean {
    return this.aba() === 'autorizacao';
  }

  private aplicarErros(erro: HttpErrorResponse, grupo: FormGroup): void {
    const corpo = erro.error as ErroApi | null;
    let aplicou = false;
    for (const e of corpo?.errors ?? []) {
      const campo = grupo.get(e.field);
      if (campo) {
        campo.setErrors({ api: e.message });
        campo.markAsTouched();
        aplicou = true;
      }
    }
    if (!aplicou) this.notificacao.erro(corpo?.message ?? 'Não foi possível salvar.');
  }

  erro(grupo: 'dados' | 'autorizacao', campo: string): string {
    const formulario: FormGroup = grupo === 'dados' ? this.dados : this.autorizacao;
    const erros = formulario.get(campo)?.errors;
    if (!erros) return '';
    if (erros['required'] || erros['somenteEspacos']) return 'Campo obrigatório.';
    if (erros['minlength']) return `Use pelo menos ${erros['minlength'].requiredLength} caracteres.`;
    if (erros['maxlength']) return `Use no máximo ${erros['maxlength'].requiredLength} caracteres.`;
    if (erros['cpfFormato']) return 'O CPF deve ter 11 números.';
    if (erros['cpfInvalido']) return 'CPF inválido.';
    if (erros['dataFutura']) return 'A data deve ser anterior a hoje.';
    if (erros['menorDeIdade']) return 'É preciso ter pelo menos 18 anos para ter conta.';
    if (erros['dataPassada']) return 'A autorização está vencida. Use uma validade futura.';
    if (erros['telefone']) return 'Informe DDD e número.';
    if (erros['pattern']) return campo === 'cep' ? 'Use 8 números, como 77001-002.' : 'De 5 a 30 letras, números, ponto, barra ou traço.';
    if (erros['api']) return erros['api'];
    return '';
  }
}
