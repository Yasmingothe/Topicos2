import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClienteRequest, Estado } from '../../../models/cliente.model';
import { ErroApi } from '../../../models/erro-api.model';
import { CepService } from '../../../services/cep.service';
import { ClienteService } from '../../../services/cliente.service';

function soNumeros(texto: string): string {
  return (texto ?? '').replace(/\D/g, '');
}

function naoSomenteEspacos(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  return valor && valor.trim().length === 0 ? { somenteEspacos: true } : null;
}

function cpfValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor)
    return null;

  const cpf = soNumeros(valor);
  if (/[^\d.\-]/.test(valor) || cpf.length !== 11)
    return { cpfFormato: true };

  if (/^(\d)\1{10}$/.test(cpf))
    return { cpfInvalido: true };

  for (let posicao = 9; posicao <= 10; posicao++) {
    let soma = 0;
    for (let i = 0; i < posicao; i++)
      soma += Number(cpf[i]) * (posicao + 1 - i);

    let digito = (soma * 10) % 11;
    if (digito === 10)
      digito = 0;

    if (digito !== Number(cpf[posicao]))
      return { cpfInvalido: true };
  }
  return null;
}

function dataNascimentoValida(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor)
    return null;

  const [ano, mes, dia] = valor.split('-').map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (nascimento >= hoje)
    return { dataFutura: true };

  let idade = hoje.getFullYear() - ano;
  const jaFezAniversario = hoje.getMonth() > mes - 1
    || (hoje.getMonth() === mes - 1 && hoje.getDate() >= dia);
  if (!jaFezAniversario)
    idade--;

  return idade < 18 ? { menorDeIdade: true } : null;
}

function telefoneValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor)
    return null;
  const tamanho = soNumeros(valor).length;
  return tamanho === 10 || tamanho === 11 ? null : { telefone: true };
}

@Component({
  selector: 'app-cliente-form',
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
  ],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private cepService = inject(CepService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = signal<number | null>(null);
  carregando = signal(false);
  salvando = signal(false);
  erroGeral = signal('');
  estados = signal<Estado[]>([]);

  buscandoCep = signal(false);
  avisoCep = signal('');
  falhaRedeCep = signal(false);
  private ultimoCepConsultado = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120), naoSomenteEspacos]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
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

  ngOnInit(): void {
    this.clienteService.listarEstados().subscribe((lista) => this.estados.set(lista));

    const idDaUrl = this.route.snapshot.paramMap.get('id');
    if (!idDaUrl)
      return;

    this.id.set(Number(idDaUrl));
    this.carregando.set(true);

    this.clienteService.buscarPorId(this.id()!).subscribe({
      next: (cliente) => {
        this.form.patchValue({
          nome: cliente.nome,
          email: cliente.email,
          cpf: cliente.cpf,
          dataNascimento: cliente.dataNascimento,
          telefone: cliente.telefone,
          cep: cliente.cep,
          logradouro: cliente.logradouro,
          numero: cliente.numero,
          complemento: cliente.complemento ?? '',
          bairro: cliente.bairro,
          cidade: cliente.municipio.nome,
          uf: cliente.municipio.estado.sigla,
        });
        this.ultimoCepConsultado = cliente.cep;
        this.carregando.set(false);
      },
      error: () => {
        this.erroGeral.set('Cliente não encontrado.');
        this.carregando.set(false);
      },
    });
  }

  buscarCep(forcar = false): void {
    const controle = this.form.controls.cep;

    if (controle.invalid) {
      controle.markAsTouched();
      return;
    }

    const cep = soNumeros(controle.value);
    if (this.buscandoCep() || (!forcar && cep === this.ultimoCepConsultado))
      return;

    this.buscandoCep.set(true);
    this.avisoCep.set('');
    this.falhaRedeCep.set(false);

    this.cepService.consultar(cep).subscribe({
      next: (endereco) => {
        this.buscandoCep.set(false);
        this.ultimoCepConsultado = cep;

        if (!endereco) {
          this.avisoCep.set('CEP não encontrado. Confira o número ou preencha o endereço manualmente.');
          return;
        }

        this.form.patchValue({
          logradouro: endereco.logradouro,
          bairro: endereco.bairro,
          cidade: endereco.localidade,
          uf: endereco.uf,
        });
      },
      error: () => {
        this.buscandoCep.set(false);
        this.falhaRedeCep.set(true);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erroGeral.set('');

    const dados = this.toRequest();
    const requisicao: Observable<unknown> = this.id()
      ? this.clienteService.alterar(this.id()!, dados)
      : this.clienteService.incluir(dados);

    requisicao.subscribe({
      next: () => this.router.navigateByUrl('/admin/clientes'),
      error: (erro: HttpErrorResponse) => {
        this.aplicarErrosDaApi(erro);
        this.salvando.set(false);
      },
    });
  }

  private toRequest(): ClienteRequest {
    const valores = this.form.getRawValue();
    return {
      ...valores,
      nome: valores.nome.trim(),
      email: valores.email.trim(),
      cpf: soNumeros(valores.cpf),
      telefone: soNumeros(valores.telefone),
      cep: soNumeros(valores.cep),
    };
  }

  private aplicarErrosDaApi(erro: HttpErrorResponse): void {
    const corpo = erro.error as ErroApi | null;

    if (erro.status === 400 && corpo?.errors?.length) {
      for (const erroCampo of corpo.errors) {
        const campo = this.form.get(erroCampo.field);
        if (campo) {
          campo.setErrors({ ...campo.errors, api: erroCampo.message });
          campo.markAsTouched();
        }
      }
      return;
    }

    this.erroGeral.set(corpo?.message ?? 'Não foi possível salvar. O back-end está rodando?');
  }

  mensagemErro(campo: string): string {
    const erros = this.form.get(campo)?.errors;
    if (!erros)
      return '';

    if (erros['required'] || erros['somenteEspacos'])
      return 'Campo obrigatório.';
    if (erros['minlength'])
      return `Use pelo menos ${erros['minlength'].requiredLength} caracteres.`;
    if (erros['maxlength'])
      return `Use no máximo ${erros['maxlength'].requiredLength} caracteres.`;
    if (erros['email'])
      return 'E-mail inválido.';
    if (erros['cpfFormato'])
      return 'O CPF deve ter 11 números.';
    if (erros['cpfInvalido'])
      return 'CPF inválido.';
    if (erros['dataFutura'])
      return 'A data de nascimento deve ser anterior a hoje.';
    if (erros['menorDeIdade'])
      return 'O cliente deve ter pelo menos 18 anos.';
    if (erros['telefone'])
      return 'Informe DDD e número (10 ou 11 números).';
    if (erros['pattern'])
      return 'CEP inválido. Use 8 números, como 77001-002.';
    if (erros['api'])
      return erros['api'];

    return '';
  }
}