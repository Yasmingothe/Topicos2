import { Component, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErroApi } from '../../../models/erro-api.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: '../auth.css',
})
export class Login {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // vêm da URL: /login?voltar=/checkout  e  /login?expirou=1
  voltar = input<string>();
  expirou = input<string>();

  entrando = signal(false);
  erro = signal('');
  mostrarSenha = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]],
  });

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.entrando.set(true);
    this.erro.set('');
    const { email, senha } = this.form.getRawValue();

    this.auth.login(email, senha).subscribe({
      next: (resposta) => {
        // admin vai para o painel; cliente volta para onde estava (ou para a loja)
        const destino = resposta.usuario.perfil.codigo === 'ADMIN'
          ? (this.voltar()?.startsWith('/admin') ? this.voltar()! : '/admin/dashboard')
          : (this.voltar() && !this.voltar()!.startsWith('/admin') ? this.voltar()! : '/');
        this.router.navigateByUrl(destino);
      },
      error: (erro: HttpErrorResponse) => {
        const corpo = erro.error as ErroApi | null;
        this.erro.set(erro.status === 0
          ? 'O servidor não respondeu. Confira se o back-end está rodando.'
          : corpo?.message ?? 'Não foi possível entrar.');
        this.entrando.set(false);
      },
    });
  }
}
