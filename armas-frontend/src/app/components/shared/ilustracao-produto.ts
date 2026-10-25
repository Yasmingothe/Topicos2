import { Component, computed, input } from '@angular/core';

// desenho do produto quando ainda não tem foto: um para cada tipo
@Component({
  selector: 'app-ilustracao-produto',
  templateUrl: './ilustracao-produto.html',
  styles: `
    :host { display: flex; align-items: center; justify-content: center; color: var(--vermelho); }
    svg { width: 100%; height: 100%; }
  `,
})
export class IlustracaoProduto {
  categoria = input.required<string>(); // código da categoria (PISTOLA, MUNICAO...)
  nome = input('');

  tipoImagem = computed(() => {
    const categoria = this.categoria();
    if (categoria === 'PISTOLA') return 'pistola';
    if (categoria === 'REVOLVER') return 'revolver';
    if (categoria === 'RIFLE_CARABINA') return 'rifle';
    if (categoria === 'ESPINGARDA') return 'espingarda';
    if (categoria === 'MUNICAO') return 'municao';
    if (categoria === 'MIRA_OPTICA') return 'mira';

    const nome = this.nome().toLowerCase();
    if (nome.includes('mira') || nome.includes('luneta')) return 'mira';
    if (nome.includes('coldre')) return 'coldre';
    return 'maleta';
  });
}
