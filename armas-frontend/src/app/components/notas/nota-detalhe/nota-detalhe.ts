import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotaEntrada } from '../../../models/nota-entrada.model';
import { NotaEntradaService } from '../../../services/nota-entrada.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { cnpj, data, moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';

import { VoltarDirective } from '../../../directives/voltar.directive';

@Component({
  selector: 'app-nota-detalhe',
  imports: [VoltarDirective, RouterLink, MatButtonModule, MatIconModule, ProdutoImagem],
  templateUrl: './nota-detalhe.html',
  styleUrl: './nota-detalhe.css',
})
export class NotaDetalhe implements OnInit {

  private notaService = inject(NotaEntradaService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);

  id = input.required<string>();

  nota = signal<NotaEntrada | null>(null);
  erro = signal('');

  data = data;
  moeda = moeda;
  cnpj = cnpj;

  ngOnInit(): void {
    this.notaService.buscarPorId(Number(this.id())).subscribe({
      next: (nota) => this.nota.set(nota),
      error: () => this.erro.set('Nota fiscal não encontrada.'),
    });
  }

  excluir(): void {
    const nota = this.nota()!;
    this.notificacao.confirmar({
      titulo: 'Excluir esta nota?',
      mensagem: `As ${nota.quantidadeTotal} unidade(s) da NF ${nota.numero} saem do estoque e os lotes dela são apagados.`,
    }).subscribe((confirmou) => {
      if (!confirmou) return;
      this.notaService.excluir(nota.id).subscribe({
        next: () => {
          this.notificacao.sucesso(`NF ${nota.numero} excluída e estoque estornado.`);
          this.router.navigateByUrl('/admin/notas');
        },
        error: (erro) => this.notificacao.erro(erro.error?.message ?? 'Não foi possível excluir a nota.'),
      });
    });
  }
}
