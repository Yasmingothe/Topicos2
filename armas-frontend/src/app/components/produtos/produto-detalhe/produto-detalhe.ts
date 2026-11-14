import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Lote } from '../../../models/lote.model';
import { Produto } from '../../../models/produto.model';
import { LoteService } from '../../../services/lote.service';
import { data, moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';
import { ESTOQUE_BAIXO } from '../../../utils/estoque';

@Component({
  selector: 'app-produto-detalhe',
  imports: [RouterLink, MatDialogModule, MatButtonModule, MatIconModule, ProdutoImagem],
  templateUrl: './produto-detalhe.html',
  styleUrl: './produto-detalhe.css',
})
export class ProdutoDetalhe implements OnInit {

  estoqueBaixoAte = ESTOQUE_BAIXO; // regra única de estoque baixo (utils/estoque.ts)

  private loteService = inject(LoteService);

  produto = signal<Produto>(inject<Produto>(MAT_DIALOG_DATA));
  lotes = signal<Lote[]>([]);

  data = data;

  ngOnInit(): void {
    // lotes que ainda têm unidades deste produto
    this.loteService.listar({ idProduto: this.produto().id, comSaldo: true }, 0, 20)
      .subscribe((pagina) => this.lotes.set(pagina.items));
  }

  formatarPreco(valor: number): string {
    return moeda(valor);
  }
}
