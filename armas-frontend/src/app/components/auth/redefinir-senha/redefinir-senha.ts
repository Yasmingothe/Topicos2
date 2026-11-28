import { Component, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErroApi } from '../../../models/erro-api.model';
import { AuthService } from '../../../services/auth.service';
import { NotificacaoService } from '../../../services/notificacao.service';

// confere se "confirmar senha" é igual à senha nova
function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const senha = grupo.get('novaSenha')?.value;
  const confirmacao = grupo.get('confirmacao')?.value;
  return senha && confirmacao && senha !== confirmacao ? { senhasDiferentes: true } : null;
}

// tela aberta pelo link do e-mail: /redefinir-senha?token=...
@Component({
  selector: 'app-redefinir-senha',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './redefinir-senha.html',
  styleUrl: '../auth.css',
})
export class RedefinirSenha {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notificacao = inject(NotificacaoService);

  // vem da URL do link do e-mail
  token = input<string>();

  salvando = signal(false);
  erro = signal('');
  mostrarSenha = signal(false);

  form = this.fb.nonNullable.group({
    novaSenha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
    confirmacao: ['', [Validators.required]],
  }, { validators: senhasIguais });

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.salvando.set(true);
    this.erro.set('');

    this.auth.redefinirSenha(this.token() ?? '', this.form.getRawValue().novaSenha).subscribe({
      next: () => {
        // se tinha alguém logado neste navegador, a sessão antiga foi derrubada no Keycloak
        this.auth.limpar();
        this.notificacao.sucesso('Senha alterada! Entre com a senha nova.');
        this.router.navigateByUrl('/login');
      },
      error: (erro: HttpErrorResponse) => {
        const corpo = erro.error as ErroApi | null;
        this.erro.set(erro.status === 0
          ? 'O servidor não respondeu. Confira se o back-end está rodando.'
          : corpo?.errors?.[0]?.message ?? corpo?.message ?? 'Não foi possível trocar a senha.');
        this.salvando.set(false);
      },
    });
  }
}
