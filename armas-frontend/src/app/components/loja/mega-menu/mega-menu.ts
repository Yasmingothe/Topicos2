import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Categoria } from '../../../models/categoria.model';
import { Marca } from '../../../models/marca.model';
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';
import { moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';

// guarda os produtos de cada categoria já aberta, para não buscar de novo a cada passada do mouse
const memoria = new Map<string, Produto[]>();

// painel grande que abre ao passar o mouse numa categoria do menu (marcas + alguns produtos)
@Component({
  selector: 'app-mega-menu',
  imports: [RouterLink, MatIconModule, ProdutoImagem],
  templateUrl: './mega-menu.html',
  styleUrl: './mega-menu.css',
})
export class MegaMenu {

  private produtoService = inject(ProdutoService);

  categoria = input<Categoria | null>(null);
  escolheu = output<void>(); // avisa o layout para fechar o painel ao clicar num link

  produtos = signal<Produto[] | null>(null); // null = carregando

  moeda = moeda;

  // marcas que têm produto nesta categoria, em ordem alfabética
  marcas = computed(() => {
    const unicas = new Map<number, Marca>();
    for (const p of this.produtos() ?? [])
      if (p.marca.id != null && !unicas.has(p.marca.id)) unicas.set(p.marca.id, p.marca);
    return [...unicas.values()].sort((a, b) => a.nome.localeCompare(b.nome));
  });

  // 3 produtos para a vitrine: com estoque, de preferência com foto
  vitrine = computed(() => {
    const disponiveis = (this.produtos() ?? []).filter((p) => p.estoque > 0);
    const temFoto = (p: Produto) => !!(p.temImagem || p.imagemUrl);
    return [...disponiveis.filter(temFoto), ...disponiveis.filter((p) => !temFoto(p))].slice(0, 3);
  });

  constructor() {
    effect(() => {
      const c = this.categoria();
      if (c) untracked(() => this.carregar(c.codigo));
    });
  }

  private carregar(codigo: string): void {
    const salvo = memoria.get(codigo);
    if (salvo) {
      this.produtos.set(salvo);
      return;
    }
    this.produtos.set(null);
    this.produtoService.listar({ categoria: codigo }, 0, 40).subscribe({
      next: (pagina) => {
        memoria.set(codigo, pagina.items);
        // só mostra se a pessoa ainda estiver nesta categoria
        if (this.categoria()?.codigo === codigo) this.produtos.set(pagina.items);
      },
      error: () => this.produtos.set([]),
    });
  }
}
