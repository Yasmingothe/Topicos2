import { Component, ElementRef, HostListener, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Categoria } from '../../models/categoria.model';
import { AuthService } from '../../services/auth.service';
import { CategoriaService } from '../../services/categoria.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { NotificacaoService } from '../../services/notificacao.service';
import { MegaMenu } from '../../components/loja/mega-menu/mega-menu';
import { RevelarDirective } from '../../directives/revelar.directive';

// moldura da loja: cabeçalho (busca, carrinho, conta) + rodapé
@Component({
  selector: 'app-loja-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule,
            MegaMenu, RevelarDirective],
  templateUrl: './loja-layout.html',
  styleUrl: './loja-layout.css',
})
export class LojaLayout {

  auth = inject(AuthService);
  carrinho = inject(CarrinhoService);
  private router = inject(Router);
  private notificacao = inject(NotificacaoService);

  categorias = signal<Categoria[]>([]);

  // em qual categoria a pessoa está agora (para deixar o item do menu marcado)
  categoriaAtual = signal<string | null>(null);
  naLoja = signal(true); // true = está no catálogo (página inicial da loja)
  verTodos = signal(false); // true = está na lista "Todos os produtos" (/?ver=todos)

  // ===== linha vermelha que desliza embaixo das categorias =====
  private trilho = viewChild<ElementRef<HTMLElement>>('trilho');
  indicador = signal({ esquerda: 0, largura: 0 });

  // ===== mega menu =====
  menuAberto = signal<Categoria | null>(null); // categoria com o painel aberto agora
  ultimoMenu = signal<Categoria | null>(null); // continua mostrando o conteúdo enquanto o painel some
  private timerMenu?: ReturnType<typeof setTimeout>;
  // só abre no passar do mouse em computador (no celular não existe hover)
  private temMouse = typeof matchMedia !== 'undefined' && matchMedia('(hover: hover)').matches;

  // ===== ícone do carrinho dá um pulinho quando entra produto =====
  pulando = signal(false);

  constructor() {
    // menu de categorias do topo
    inject(CategoriaService).listar().subscribe((lista) => {
      this.categorias.set(lista);
      setTimeout(() => this.posicionarIndicador());
    });

    this.lerUrl();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.lerUrl());

    // quando a fonte termina de carregar, a largura das palavras muda: reposiciona a linha
    document.fonts?.ready.then(() => this.posicionarIndicador());

    let quantidadeAnterior = this.carrinho.quantidadeTotal();
    effect(() => {
      const atual = this.carrinho.quantidadeTotal();
      if (atual > quantidadeAnterior) untracked(() => this.pularCarrinho());
      quantidadeAnterior = atual;
    });
  }

  private lerUrl(): void {
    const arvore = this.router.parseUrl(this.router.url);
    this.categoriaAtual.set(arvore.queryParams['categoria'] ?? null);
    this.verTodos.set(arvore.queryParams['ver'] === 'todos');
    this.naLoja.set(!arvore.root.children['primary']);
    this.menuAberto.set(null);
    setTimeout(() => this.posicionarIndicador());
  }

  primeiroNome = computed(() => (this.auth.usuario()?.nome ?? '').split(' ')[0]);
  ano = new Date().getFullYear();

  buscar(evento: Event, texto: string): void {
    evento.preventDefault();
    this.router.navigate(['/'], { queryParams: texto.trim() ? { busca: texto.trim() } : {} });
  }

  sair(): void {
    this.auth.sair();
    this.notificacao.sucesso('Você saiu da sua conta.');
    this.router.navigateByUrl('/');
  }

  // ===== indicador =====

  // sem "alvo", volta para a categoria marcada (ou some, se nenhuma estiver marcada)
  posicionarIndicador(alvo?: Element | null): void {
    const trilho = this.trilho()?.nativeElement;
    if (!trilho) return;
    const link = (alvo ?? trilho.querySelector('.link-categoria.ativo')) as HTMLElement | null;
    if (!link) {
      this.indicador.update((i) => ({ ...i, largura: 0 }));
      return;
    }
    // 14px = espaço interno do link: a linha fica só embaixo do texto
    this.indicador.set({ esquerda: link.offsetLeft + 14, largura: link.offsetWidth - 28 });
  }

  @HostListener('window:resize')
  aoRedimensionar(): void {
    this.posicionarIndicador();
  }

  // ===== mouse no menu de categorias =====

  entrarCategoria(evento: Event, categoria: Categoria | null): void {
    this.posicionarIndicador(evento.currentTarget as Element);
    if (!this.temMouse) return;

    clearTimeout(this.timerMenu);
    if (!categoria) {
      this.menuAberto.set(null);
      return;
    }
    // espera um instante antes de abrir (para não abrir só de passar o mouse por cima);
    // se o painel já está aberto, troca na hora
    const espera = this.menuAberto() ? 0 : 150;
    this.timerMenu = setTimeout(() => {
      this.ultimoMenu.set(categoria);
      this.menuAberto.set(categoria);
    }, espera);
  }

  sairMenu(): void {
    this.posicionarIndicador();
    clearTimeout(this.timerMenu);
    this.timerMenu = setTimeout(() => this.menuAberto.set(null), 150);
  }

  fecharMenu(): void {
    clearTimeout(this.timerMenu);
    this.menuAberto.set(null);
  }

  private pularCarrinho(): void {
    this.pulando.set(false);
    requestAnimationFrame(() => this.pulando.set(true));
    setTimeout(() => this.pulando.set(false), 600);
  }
}
