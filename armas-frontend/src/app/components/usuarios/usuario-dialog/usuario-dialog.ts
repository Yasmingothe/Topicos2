import { Component, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ErroApi } from '../../../models/erro-api.model';
import { NotificacaoService } from '../../../services/notificacao.service';
import { OpcaoService } from '../../../services/opcao.service';
import { UsuarioService } from '../../../services/usuario.service';
import { naoSomenteEspacos } from '../../../utils/validadores';

// janela "Novo usuário" (o admin pode criar outro admin)
@Component({
  selector: 'app-usuario-dialog',
  imports: [AsyncPipe, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <form class="janela" [formGroup]="form" (ngSubmit)="salvar()">
      <h2>Novo usuário</h2>
      @if (erro()) { <p class="mensagem-erro">{{ erro() }}</p> }

      <mat-form-field appearance="outline">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="nome">
        <mat-error>Informe o nome.</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>E-mail (login)</mat-label>
        <input matInput type="email" formControlName="email">
        <mat-error>{{ form.controls.email.errors?.['api'] ?? 'Informe um e-mail válido.' }}</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Senha inicial</mat-label>
        <input matInput type="password" formControlName="senha" autocomplete="new-password">
        <mat-hint>A pessoa usa esta senha no primeiro acesso.</mat-hint>
        <mat-error>Pelo menos 6 caracteres.</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Perfil</mat-label>
        <mat-select formControlName="perfil">
          @for (perfil of (opcoes.perfis$ | async) ?? []; track perfil.codigo) {
            <mat-option [value]="perfil.codigo">{{ perfil.nome }}</mat-option>
          }
        </mat-select>
      </mat-form-field>

      <div class="botoes">
        <button mat-stroked-button type="button" mat-dialog-close>Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="salvando()">
          {{ salvando() ? 'Criando...' : 'Criar usuário' }}
        </button>
      </div>
    </form>
  `,
  styles: `
    .janela { display: flex; flex-direction: column; padding: 24px; color: var(--texto); }
    h2 { margin: 0 0 16px; font-family: var(--fonte-titulo); font-size: 26px; font-weight: 600; }
    .botoes { display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
  `,
})
export class UsuarioDialog {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private notificacao = inject(NotificacaoService);
  private janela = inject(MatDialogRef<UsuarioDialog>);
  opcoes = inject(OpcaoService);

  salvando = signal(false);
  erro = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), naoSomenteEspacos]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    perfil: ['ADMIN', [Validators.required]],
  });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.usuarioService.incluir(this.form.getRawValue()).subscribe({
      next: (usuario) => {
        this.notificacao.sucesso(`Usuário ${usuario.nome} criado.`);
        this.janela.close(true);
      },
      error: (erro: HttpErrorResponse) => {
        const corpo = erro.error as ErroApi | null;
        const erroEmail = corpo?.errors?.find((e) => e.field === 'email');
        if (erroEmail) this.form.controls.email.setErrors({ api: erroEmail.message });
        else this.erro.set(corpo?.message ?? 'Não foi possível criar o usuário.');
        this.salvando.set(false);
      },
    });
  }
}
