import { Component, OnInit, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ErroApi } from '../../../models/erro-api.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { cnpj, soNumeros, telefone } from '../../../utils/formatar';
import { cnpjValido, naoSomenteEspacos, telefoneValido } from '../../../utils/validadores';

import { VoltarDirective } from '../../../directives/voltar.directive';

@Component({
  selector: 'app-fornecedor-form',
  imports: [VoltarDirective, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './fornecedor-form.html',
})
export class FornecedorForm implements OnInit {

  private fb = inject(FormBuilder);
  private fornecedorService = inject(FornecedorService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);

  id = input<string>(); // vem da rota /editar/:id

  carregando = signal(false);
  salvando = signal(false);
  erroGeral = signal('');

  form = this.fb.nonNullable.group({
    razaoSocial: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120), naoSomenteEspacos]],
    nomeFantasia: ['', [Validators.maxLength(80)]],
    cnpj: ['', [Validators.required, cnpjValido]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    telefone: ['', [telefoneValido]],
    ativo: [true],
  });

  ngOnInit(): void {
    if (!this.id()) return;
    this.carregando.set(true);
    this.fornecedorService.buscarPorId(Number(this.id())).subscribe({
      next: (f) => {
        this.form.patchValue({
          razaoSocial: f.razaoSocial,
          nomeFantasia: f.nomeFantasia ?? '',
          cnpj: cnpj(f.cnpj),
          email: f.email ?? '',
          telefone: f.telefone ? telefone(f.telefone) : '',
          ativo: f.ativo,
        });
        this.carregando.set(false);
      },
      error: () => {
        this.erroGeral.set('Fornecedor não encontrado.');
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

    const valores = this.form.getRawValue();
    const dados = { ...valores, cnpj: soNumeros(valores.cnpj), telefone: soNumeros(valores.telefone) };
    const requisicao: Observable<unknown> = this.id()
      ? this.fornecedorService.alterar(Number(this.id()), dados)
      : this.fornecedorService.incluir(dados);

    requisicao.subscribe({
      next: () => {
        this.notificacao.sucesso(this.id() ? 'Fornecedor atualizado.' : 'Fornecedor cadastrado.');
        this.router.navigateByUrl('/admin/fornecedores');
      },
      error: (erro: HttpErrorResponse) => {
        const corpo = erro.error as ErroApi | null;
        if (erro.status === 400 && corpo?.errors?.length) {
          for (const e of corpo.errors) {
            const campo = this.form.get(e.field);
            campo?.setErrors({ api: e.message });
            campo?.markAsTouched();
          }
        } else {
          this.erroGeral.set(corpo?.message ?? 'Não foi possível salvar. O back-end está rodando?');
        }
        this.salvando.set(false);
      },
    });
  }

  mensagemErro(campo: string): string {
    const erros = this.form.get(campo)?.errors;
    if (!erros) return '';
    if (erros['required'] || erros['somenteEspacos']) return 'Campo obrigatório.';
    if (erros['minlength']) return `Use pelo menos ${erros['minlength'].requiredLength} caracteres.`;
    if (erros['maxlength']) return `Use no máximo ${erros['maxlength'].requiredLength} caracteres.`;
    if (erros['email']) return 'E-mail inválido.';
    if (erros['cnpjFormato']) return 'O CNPJ deve ter 14 números.';
    if (erros['cnpjInvalido']) return 'CNPJ inválido.';
    if (erros['telefone']) return 'Informe DDD e número (10 ou 11 números).';
    if (erros['api']) return erros['api'];
    return '';
  }
}
