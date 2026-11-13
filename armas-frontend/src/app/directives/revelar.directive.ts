import { DestroyRef, Directive, ElementRef, afterNextRender, computed, inject, input, signal } from '@angular/core';

// Coloque appRevelar num elemento para ele SURGIR (fade + subida leve) quando aparecer na tela.
// O número é a posição na lista: cria um pequeno atraso em cascata (0, 70, 140, 210 ms...).
// Uso: <article [appRevelar]="$index"> ou só <div appRevelar>
// A animação em si fica no styles.css (classes .revelar e .visivel).
@Directive({
  selector: '[appRevelar]',
  host: {
    class: 'revelar',
    '[class.visivel]': 'visivel()',
    '[style.--atraso]': 'atraso()',
  },
})
export class RevelarDirective {

  appRevelar = input<number | string>('');

  visivel = signal(false);

  // a cascata recomeça a cada 4 itens (uma linha da grade), para não ficar lento
  atraso = computed(() => `${((Number(this.appRevelar()) || 0) % 4) * 70}ms`);

  constructor() {
    const elemento = inject(ElementRef).nativeElement as HTMLElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        this.visivel.set(true);
        return;
      }
      // avisa quando o elemento entra na tela; depois disso para de observar
      const observador = new IntersectionObserver((entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          this.visivel.set(true);
          observador.disconnect();
        }
      }, { rootMargin: '0px 0px -40px 0px' });

      observador.observe(elemento);
      destroyRef.onDestroy(() => observador.disconnect());
    });
  }
}
