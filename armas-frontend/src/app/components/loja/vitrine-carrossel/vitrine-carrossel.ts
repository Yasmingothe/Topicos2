import { Component, ElementRef, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Produto } from '../../../models/produto.model';
import { moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';
import { RevelarDirective } from '../../../directives/revelar.directive';

// faixa de produtos que rola para o lado, com setas (igual vitrine de loja de roupa)
@Component({
  selector: 'app-vitrine-carrossel',
  imports: [RouterLink, MatIconModule, ProdutoImagem, RevelarDirective],
  templateUrl: './vitrine-carrossel.html',
  styleUrl: './vitrine-carrossel.css',
})
export class VitrineCarrossel {

  titulo = input.required<string>();
  produtos = input.required<Produto[]>();
  categoria = input<string | null>(null); // para o link "Ver tudo"

  private trilho = viewChild<ElementRef<HTMLElement>>('trilho');

  moeda = moeda;

  parcela(valor: number): string {
    return moeda(valor / 10);
  }

  // anda quase uma "tela" de cards para o lado
  rolar(direcao: 1 | -1): void {
    const trilho = this.trilho()?.nativeElement;
    if (!trilho) return;
    trilho.scrollBy({ left: direcao * trilho.clientWidth * 0.9, behavior: 'smooth' });
  }
}
