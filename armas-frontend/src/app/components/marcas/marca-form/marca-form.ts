import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Marca } from '../../../models/marca.model';
import { ErroApi } from '../../../models/erro-api.model';
import { MarcaService } from '../../../services/marca.service';
import { NotificacaoService } from '../../../services/notificacao.service';

// lista de sugestões do campo "País de origem"
const PAISES = [
  'Alemanha', 'Argentina', 'Áustria', 'Bélgica', 'Brasil', 'Canadá', 'China',
  'Croácia', 'Espanha', 'Estados Unidos', 'Filipinas', 'França', 'Israel',
  'Itália', 'Japão', 'Portugal', 'Reino Unido', 'República Tcheca', 'Rússia',
  'Suécia', 'Suíça', 'Turquia',
];

function naoSomenteEspacos(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  return valor && valor.trim().length === 0 ? { somenteEspacos: true } : null;
}

import { VoltarDirective } from '../../../directives/voltar.directive';

@Component({
  selector: 'app-marca-form',
  imports: [VoltarDirective, 
    ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatAutocompleteModule,
  ],
  templateUrl: './marca-form.html',
  styleUrl: './marca-form.css',
})
export class MarcaForm implements OnInit {

  private fb = inject(FormBuilder);
  private marcaService = inject(MarcaService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = signal<number | null>(null);
  carregando = signal(false);
  salvando = signal(false);
  erroGeral = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', [
      Validators.required, Validators.minLength(2), Validators.maxLength(60), naoSomenteEspacos,
    ]],
    paisOrigem: ['', [Validators.required, Validators.maxLength(40), naoSomenteEspacos]],
    ativa: [true],
  });

  // acompanha o que está sendo digitado no campo país...
  private paisDigitado = toSignal(this.form.controls.paisOrigem.valueChanges, { initialValue: '' });

  // ...e mostra só os países que contêm o texto digitado
  paisesFiltrados = computed(() => {
    const texto = (this.paisDigitado() ?? '').toLowerCase();
    return PAISES.filter((pais) => pais.toLowerCase().includes(texto));
  });

  ngOnInit(): void {
    const idDaUrl = this.route.snapshot.paramMap.get('id');
    if (!idDaUrl)
      return;

    this.id.set(Number(idDaUrl));
    this.carregando.set(true);

    this.marcaService.buscarPorId(this.id()!).subscribe({
      next: (marca) => {
        this.form.patchValue(marca);
        this.carregando.set(false);
      },
      error: () => {
        this.erroGeral.set('Marca não encontrada.');
        this.carregando.set(false);
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

    const dados = this.form.getRawValue() as Marca;
    const requisicao: Observable<unknown> = this.id()
      ? this.marcaService.alterar(this.id()!, dados)
      : this.marcaService.incluir(dados);

    requisicao.subscribe({
      // deu certo: mostra o aviso verde e volta para a lista
      next: () => {
        this.notificacao.sucesso(this.id() ? 'Marca atualizada com sucesso.' : 'Marca cadastrada com sucesso.');
        this.router.navigateByUrl('/admin/marcas');
      },
      error: (erro: HttpErrorResponse) => {
        this.aplicarErrosDaApi(erro);
        this.salvando.set(false);
      },
    });
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

  mensagemErro(campo: 'nome' | 'paisOrigem'): string {
    const controle = this.form.controls[campo];

    if (controle.hasError('required') || controle.hasError('somenteEspacos'))
      return campo === 'nome' ? 'Informe o nome da marca.' : 'Informe o país de origem.';
    if (controle.hasError('minlength'))
      return 'O nome deve ter pelo menos 2 caracteres.';
    if (controle.hasError('maxlength'))
      return `Use no máximo ${controle.errors?.['maxlength'].requiredLength} caracteres.`;
    if (controle.hasError('api'))
      return controle.errors?.['api'];

    return '';
  }
}