import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

type Valor = string | number | null;

// botão de filtro "MARCA ▾" usado em todas as listas (loja e painel).
// Clicando, abre a lista de opções; a escolhida fica com ✓ e o botão mostra "MARCA: GLOCK".
//
// Uso:
//   <app-filtro-menu rotulo="Marca" textoTodos="Todas as marcas"
//                    [opcoes]="marcas()" campoValor="id" campoNome="nome"
//                    [valor]="filtroMarca()" (mudou)="filtrarPorMarca($event)" />
@Component({
  selector: 'app-filtro-menu',
  imports: [MatIconModule, MatMenuModule],
  template: `
    <button type="button" class="botao-filtro" [class.ativo]="valor() !== null && valor() !== undefined"
            [matMenuTriggerFor]="menu">
      <span class="texto">{{ nomeEscolhido() ? rotulo() + ': ' + nomeEscolhido() : rotulo() }}</span>
      <mat-icon>expand_more</mat-icon>
    </button>
    <mat-menu #menu="matMenu" xPosition="before" class="menu-filtro">
      <button mat-menu-item (click)="mudou.emit(null)">
        {{ textoTodos() }} @if (valor() === null || valor() === undefined) { <mat-icon class="marcado">check</mat-icon> }
      </button>
      @for (opcao of opcoes(); track $index) {
        <button mat-menu-item (click)="mudou.emit(valorDe(opcao))">
          {{ nomeDe(opcao) }} @if (valorDe(opcao) === valor()) { <mat-icon class="marcado">check</mat-icon> }
        </button>
      }
    </mat-menu>
  `,
  styles: `
    :host { display: inline-block; }
    .botao-filtro {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 40px;
      max-width: 280px;
      padding: 0 12px 0 16px;
      border: 1px solid var(--borda);
      border-radius: 4px;
      background: transparent;
      color: var(--texto);
      font: inherit;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
      cursor: pointer;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }
    .texto { overflow: hidden; text-overflow: ellipsis; }
    .botao-filtro mat-icon { flex: none; font-size: 18px; width: 18px; height: 18px; transition: transform 0.2s ease; }
    .botao-filtro:hover { border-color: #4a3d3d; }
    .botao-filtro[aria-expanded='true'] mat-icon { transform: rotate(180deg); }
    .botao-filtro.ativo { border-color: var(--vermelho); background: var(--vermelho-escuro); }
    .marcado { margin-left: 8px; color: var(--vermelho); }
  `,
})
export class FiltroMenu {

  rotulo = input.required<string>();        // "Marca"
  textoTodos = input('Todos');              // primeira opção, que tira o filtro
  opcoes = input<readonly object[]>([]);    // lista de marcas, categorias, situações...
  campoValor = input('codigo');             // qual campo do objeto é o valor (id, codigo...)
  campoNome = input('nome');                // qual campo é o texto que aparece
  campoNomeReserva = input<string | null>(null); // usado se o campoNome estiver vazio
  valor = input<Valor | undefined>(null);   // valor escolhido agora

  mudou = output<Valor>();

  nomeEscolhido = computed(() => {
    const atual = this.valor();
    if (atual === null || atual === undefined) return '';
    const achou = this.opcoes().find((o) => this.valorDe(o) === atual);
    return achou ? this.nomeDe(achou) : '';
  });

  valorDe(opcao: object): Valor {
    return (opcao as Record<string, Valor>)[this.campoValor()] ?? null;
  }

  nomeDe(opcao: object): string {
    const o = opcao as Record<string, string | null | undefined>;
    const reserva = this.campoNomeReserva();
    return o[this.campoNome()] || (reserva ? o[reserva] ?? '' : '');
  }
}
