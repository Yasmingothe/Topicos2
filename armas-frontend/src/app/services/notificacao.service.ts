import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map } from 'rxjs';
import { Confirmacao, DadosConfirmacao } from '../components/shared/confirmacao/confirmacao';

// um lugar só para os avisos e confirmações do sistema todo
@Injectable({ providedIn: 'root' })
export class NotificacaoService {

  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  // aviso verde no canto da tela
  sucesso(mensagem: string): void {
    this.snackBar.open(mensagem, 'OK', {
      duration: 3500,
      panelClass: 'aviso-sucesso',
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  // aviso vermelho no canto da tela
  erro(mensagem: string): void {
    this.snackBar.open(mensagem, 'FECHAR', {
      duration: 6000,
      panelClass: 'aviso-erro',
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  // abre a janela de confirmação e devolve true (confirmou) ou false (cancelou)
  confirmar(dados: DadosConfirmacao): Observable<boolean> {
    return this.dialog
      .open(Confirmacao, { data: dados, width: '400px', panelClass: 'janela-produto' })
      .afterClosed()
      .pipe(map((resposta) => resposta === true));
  }
}