import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

// componente raiz: só troca entre loja, login e painel (cada um tem sua moldura)
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  constructor() {
    // ao abrir o site com sessão salva, confere no back quem está logado
    inject(AuthService).conferirSessao();
  }
}
