import { Component, OnInit, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: '../auth.css',
})
export class Login implements OnInit {
  private auth = inject(AuthService);

  // vêm da URL: /login?voltar=/checkout  e  /login?expirou=1
  voltar = input<string>();
  expirou = input<string>();

  ngOnInit(): void {
    const destino = this.obterDestino();
    // Redireciona para o login do Keycloak
    this.auth.login(destino);
  }

  entrar(): void {
    this.auth.login(this.obterDestino());
  }

  private obterDestino(): string {
    const caminho = this.voltar();
    return caminho ? window.location.origin + caminho : window.location.origin;
  }
}
