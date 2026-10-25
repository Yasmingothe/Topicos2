import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// informações que a janela recebe
export interface DadosConfirmacao {
  titulo: string;
  mensagem: string;
  textoBotao?: string;
  icone?: string; // ícone do Material no topo (padrão: lixeira)
}

// janela usada no lugar do confirm() do navegador
@Component({
  selector: 'app-confirmacao',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="janela">
      <span class="icone"><mat-icon>{{ dados.icone ?? 'delete_forever' }}</mat-icon></span>
      <h2>{{ dados.titulo }}</h2>
      <p>{{ dados.mensagem }}</p>

      <div class="botoes">
        <button mat-stroked-button [mat-dialog-close]="false">CANCELAR</button>
        <button mat-flat-button [mat-dialog-close]="true">{{ dados.textoBotao ?? 'EXCLUIR' }}</button>
      </div>
    </div>
  `,
  styles: `
    .janela { padding: 28px; text-align: center; color: var(--texto); }
    .icone {
      width: 60px; height: 60px; border-radius: 50%;
      display: inline-flex; align-items: center; justify-content: center;
      background: var(--vermelho-escuro); color: var(--vermelho);
    }
    .icone mat-icon { font-size: 30px; width: 30px; height: 30px; }
    h2 { margin: 16px 0 8px; font-size: 18px; }
    p { margin: 0; color: var(--texto-suave); font-size: 14px; line-height: 1.5; }
    .botoes { display: flex; gap: 10px; margin-top: 24px; }
    .botoes button { flex: 1; height: 44px; font-weight: 700; letter-spacing: 0.06em; }
  `,
})
export class Confirmacao {
  dados = inject<DadosConfirmacao>(MAT_DIALOG_DATA);
}