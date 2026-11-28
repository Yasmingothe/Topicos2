import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErroApi } from '../../../models/erro-api.model';
import { AuthService } from '../../../services/auth.service';

// "Esqueci minha senha": a pessoa informa o e-mail e o back manda um link
@Component({
  selector: 'app-esqueci-senha',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './esqueci-senha.html',
  styleUrl: '../auth.css',
})
export class EsqueciSenha {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  enviando = signal(false);
  enviado = signal(false);
  erro = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.erro.set('');

    this.auth.esqueciSenha(this.form.getRawValue().email.trim()).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
      },
      error: (erro: HttpErrorResponse) => {
        const corpo = erro.error as ErroApi | null;
        this.erro.set(erro.status === 0
          ? 'O servidor não respondeu. Confira se o back-end está rodando.'
          : corpo?.message ?? 'Não foi possível enviar o e-mail.');
        this.enviando.set(false);
      },
    });
  }
}
