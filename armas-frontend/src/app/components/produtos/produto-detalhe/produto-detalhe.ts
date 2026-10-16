import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Produto } from '../../../models/produto.model';

@Component({
  selector: 'app-produto-detalhe',
  imports: [RouterLink, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './produto-detalhe.html',
  styleUrl: './produto-detalhe.css',
})
export class ProdutoDetalhe {

  produto = inject<Produto>(MAT_DIALOG_DATA);

  private moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  tipoImagem(): string {
    const categoria = this.produto.categoria.codigo;

    if (categoria === 'PISTOLA') return 'pistola';
    if (categoria === 'REVOLVER') return 'revolver';
    if (categoria === 'RIFLE_CARABINA') return 'rifle';
    if (categoria === 'ESPINGARDA') return 'espingarda';
    if (categoria === 'MUNICAO') return 'municao';

    
    const nome = this.produto.nome.toLowerCase();
    if (nome.includes('mira') || nome.includes('luneta')) return 'mira';
    if (nome.includes('coldre')) return 'coldre';
    return 'maleta';
  }

  formatarPreco(valor: number): string {
    return this.moeda.format(valor);
  }
}