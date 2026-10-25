import { Component, inject, signal } from '@angular/core';
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
import { naoSomenteEspacos } from '../../../utils/validadores';

// confere se "confirmar senha" é igual à senha
function senhasIguais(grupo: AbstractControl): ValidationErrors | null {
  const senha = grupo.get('senha')?.value;
  const confirmacao = grupo.get('confirmacao')?.value;
  return senha && confirmacao && senha !== confirmacao ? { senhasDiferentes: true } : null;
}

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './cadastro.html',
  styleUrl: '../auth.css',
})
export class Cadastro {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private notificacao = inject(NotificacaoService);

  salvando = signal(false);
  erro = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120), naoSomenteEspacos]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(60)]],
    confirmacao: ['', [Validators.required]],
  }, { validators: senhasIguais });

  criar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erro.set('');
    const { nome, email, senha } = this.form.getRawValue();

    this.auth.cadastrar(nome.trim(), email.trim(), senha).subscribe({
      next: () => {
        this.notificacao.sucesso('Conta criada. Complete seus dados para poder comprar.');
        this.router.navigateByUrl('/minha-conta');
      },
      error: (erro: HttpErrorResponse) => {
        const corpo = erro.error as ErroApi | null;
        const erroEmail = corpo?.errors?.find((e) => e.field === 'email');
        if (erroEmail) {
          this.form.controls.email.setErrors({ api: erroEmail.message });
          this.form.controls.email.markAsTouched();
        } else {
          this.erro.set(corpo?.message ?? 'Não foi possível criar a conta.');
        }
        this.salvando.set(false);
      },
    });
  }

  erroEmail(): string {
    const erros = this.form.controls.email.errors;
    if (erros?.['api']) return erros['api'];
    return 'Informe um e-mail válido.';
  }
}
