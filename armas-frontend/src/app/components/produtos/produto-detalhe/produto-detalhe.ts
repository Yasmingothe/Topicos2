import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Produto, ProdutoRequest } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { NotificacaoService } from '../../../services/notificacao.service';

@Component({
  selector: 'app-produto-detalhe',
  imports: [RouterLink, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './produto-detalhe.html',
  styleUrl: './produto-detalhe.css',
})
export class ProdutoDetalhe {

  private produtoService = inject(ProdutoService);
  private notificacao = inject(NotificacaoService);

  produto = signal<Produto>(inject<Produto>(MAT_DIALOG_DATA));

  quantidade = signal(1);
  movimentando = signal(false);

  private moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  tipoImagem(): string {
    const categoria = this.produto().categoria.codigo;

    if (categoria === 'PISTOLA') return 'pistola';
    if (categoria === 'REVOLVER') return 'revolver';
    if (categoria === 'RIFLE_CARABINA') return 'rifle';
    if (categoria === 'ESPINGARDA') return 'espingarda';
    if (categoria === 'MUNICAO') return 'municao';

    const nome = this.produto().nome.toLowerCase();
    if (nome.includes('mira') || nome.includes('luneta')) return 'mira';
    if (nome.includes('coldre')) return 'coldre';
    return 'maleta';
  }

  formatarPreco(valor: number): string {
    return this.moeda.format(valor);
  }

  // ===== MOVIMENTAR ESTOQUE =====
  // entrada = soma no estoque | saída = tira do estoque
  movimentar(tipo: 'entrada' | 'saida'): void {
    const qtd = Math.floor(this.quantidade());
    if (!qtd || qtd < 1) {
      this.notificacao.erro('Informe uma quantidade maior que zero.');
      return;
    }

    const p = this.produto();
    const novoEstoque = tipo === 'entrada' ? p.estoque + qtd : p.estoque - qtd;

    if (novoEstoque < 0) {
      this.notificacao.erro(`Estoque insuficiente: só há ${p.estoque} unidade(s).`);
      return;
    }

    const dados: ProdutoRequest = {
      nome: p.nome,
      idMarca: p.marca.id!,
      categoria: p.categoria.codigo,
      calibre: p.calibre ?? '',
      preco: p.preco,
      estoque: novoEstoque,
      descricao: p.descricao ?? '',
      publicado: p.publicado,
    };

    this.movimentando.set(true);

    this.produtoService.alterar(p.id, dados).subscribe({
      next: () => {
        this.produto.update((atual) => ({ ...atual, estoque: novoEstoque }));
        this.notificacao.sucesso(
          tipo === 'entrada'
            ? `Entrada de ${qtd} un. registrada. Estoque: ${novoEstoque}.`
            : `Saída de ${qtd} un. registrada. Estoque: ${novoEstoque}.`,
        );
        this.quantidade.set(1);
        this.movimentando.set(false);
      },
      error: (erro) => {
        this.notificacao.erro(erro.error?.message ?? 'Não foi possível atualizar o estoque.');
        this.movimentando.set(false);
      },
    });
  }
}