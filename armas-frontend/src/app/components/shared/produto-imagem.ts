import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { IlustracaoProduto } from './ilustracao-produto';

// mostra a foto do produto; se não tiver (ou der erro ao carregar), mostra o desenho.
// tudo fica no mesmo "estúdio": fundo preto com brilho vermelho, para a loja ter uma cara só
@Component({
  selector: 'app-produto-imagem',
  imports: [IlustracaoProduto],
  host: { '[class.com-foto]': 'mostrarFoto()', '[class.conter]': "ajuste() === 'conter'" },
  template: `
    @if (mostrarFoto()) {
      <img [src]="endereco()" [alt]="nome()" loading="lazy" (error)="falhou.set(true)">
    } @else {
      <app-ilustracao-produto [categoria]="categoria()" [nome]="nome()" class="desenho" />
    }
  `,
  styles: `
    :host {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      --recorte: #120c0c;
      background:
        radial-gradient(circle at 50% 58%, rgba(214, 58, 58, 0.30) 0%, rgba(214, 58, 58, 0.10) 32%, transparent 62%),
        linear-gradient(180deg, #151010 0%, #0a0808 100%);
    }
    /* a foto preenche o quadrado inteiro (as imagens geradas já vêm com o fundo do estúdio) */
    img { width: 100%; height: 100%; object-fit: cover; }
    /* "conter": mostra a foto inteira, sem cortar (para espaços que não são quadrados) */
    :host(.conter) img { object-fit: contain; }
    .desenho { width: 70%; height: 70%; }
  `,
})
export class ProdutoImagem {
  produtoService = inject(ProdutoService);

  idProduto = input.required<number>();
  categoria = input.required<string>();
  nome = input('');
  temImagem = input(false);              // foto enviada (arquivo no back)
  imagemUrl = input<string | null>(null); // ou link de foto
  versao = input('');
  ajuste = input<'cobrir' | 'conter'>('cobrir'); // cobrir = preenche cortando as bordas

  falhou = signal(false);

  // o arquivo enviado tem prioridade; sem ele, usa o link
  endereco = computed(() => this.temImagem()
    ? this.produtoService.urlImagem(this.idProduto(), this.versao())
    : this.imagemUrl() ?? '');

  mostrarFoto = computed(() => !!this.endereco() && !this.falhou());

  constructor() {
    // se trocar a foto (ou o link), tenta carregar de novo
    effect(() => {
      this.endereco();
      untracked(() => this.falhou.set(false));
    });
  }
}
