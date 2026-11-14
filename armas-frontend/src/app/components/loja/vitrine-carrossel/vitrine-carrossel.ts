import { Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Produto } from '../../../models/produto.model';
import { moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';
import { RevelarDirective } from '../../../directives/revelar.directive';

// faixa de produtos que anda para o lado, sempre de "página" em "página"
// (4 cards no computador, 2 no celular), sem nunca parar no meio de um card
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

  private janela = viewChild<ElementRef<HTMLElement>>('janela');

  inicio = signal(0); // posição do primeiro card que aparece

  // quantas "páginas" existem (para as bolinhas embaixo)
  paginas = computed(() => Math.max(1, Math.ceil(this.produtos().length / this.porVez())));
  listaPaginas = computed(() => Array.from({ length: this.paginas() }, (_, i) => i));
  paginaAtual = computed(() => Math.ceil(this.inicio() / this.porVez()));
  porVez = signal(4);

  moeda = moeda;

  private toqueInicioX = 0;

  constructor() {
    // se a lista mudar, volta para o começo
    effect(() => {
      this.produtos();
      this.inicio.set(0);
    });
  }

  parcela(valor: number): string {
    return moeda(valor / 10);
  }

  // lê do CSS quantos cards cabem (4 no computador, 2 no celular)
  private atualizarPorVez(): number {
    const janela = this.janela()?.nativeElement;
    const valor = janela ? Number(getComputedStyle(janela).getPropertyValue('--por-vez')) : 4;
    const porVez = valor || 4;
    this.porVez.set(porVez);
    return porVez;
  }

  // anda uma página; no fim volta para o começo, e no começo vai para o fim
  andar(direcao: 1 | -1): void {
    const porVez = this.atualizarPorVez();
    const ultimo = Math.max(0, this.produtos().length - porVez);
    const atual = this.inicio();

    if (direcao === 1) this.inicio.set(atual >= ultimo ? 0 : Math.min(atual + porVez, ultimo));
    else this.inicio.set(atual <= 0 ? ultimo : Math.max(atual - porVez, 0));
  }

  irParaPagina(pagina: number): void {
    const porVez = this.atualizarPorVez();
    const ultimo = Math.max(0, this.produtos().length - porVez);
    this.inicio.set(Math.min(pagina * porVez, ultimo));
  }

  // arrastar o dedo no celular
  tocar(evento: TouchEvent): void {
    this.toqueInicioX = evento.touches[0].clientX;
  }

  soltar(evento: TouchEvent): void {
    const distancia = evento.changedTouches[0].clientX - this.toqueInicioX;
    if (Math.abs(distancia) > 40) this.andar(distancia < 0 ? 1 : -1);
  }
}
