import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Categoria } from '../../../models/categoria.model';
import { Marca } from '../../../models/marca.model';
import { Produto } from '../../../models/produto.model';
import { AuthService } from '../../../services/auth.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { CategoriaService } from '../../../services/categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { ProdutoService } from '../../../services/produto.service';
import { moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';
import { RevelarDirective } from '../../../directives/revelar.directive';
import { VitrineCarrossel } from '../vitrine-carrossel/vitrine-carrossel';

const POR_PAGINA = 12;

// ordem de preferência das categorias no banner de destaque
const ORDEM_DESTAQUE = ['PISTOLA', 'RIFLE_CARABINA', 'REVOLVER', 'ESPINGARDA'];
// categorias de arma e munição (o resto entra em "Para completar o kit")
const ARMAS_E_MUNICAO = [...ORDEM_DESTAQUE, 'MUNICAO'];

const temFoto = (p: Produto) => !!(p.temImagem || p.imagemUrl);

// com estoque e com foto primeiro
function ordenarVitrine(lista: Produto[]): Produto[] {
  const disponiveis = lista.filter((p) => p.estoque > 0);
  return [...disponiveis.filter(temFoto), ...disponiveis.filter((p) => !temFoto(p))];
}

// escolhe até 4 produtos para o banner: com estoque, com foto primeiro, um de cada categoria
function escolherDestaques(lista: Produto[]): Produto[] {
  const temFoto = (p: Produto) => !!(p.temImagem || p.imagemUrl);
  const disponiveis = lista.filter((p) => p.estoque > 0);
  const ordenados = [...disponiveis.filter(temFoto), ...disponiveis.filter((p) => !temFoto(p))];

  const escolhidos: Produto[] = [];
  for (const codigo of ORDEM_DESTAQUE) {
    const achou = ordenados.find((p) => p.categoria.codigo === codigo);
    if (achou) escolhidos.push(achou);
  }
  // se faltar, completa com outros produtos
  for (const p of ordenados) {
    if (escolhidos.length >= 4) break;
    if (!escolhidos.includes(p)) escolhidos.push(p);
  }
  return escolhidos.length ? escolhidos.slice(0, 4) : lista.slice(0, 1);
}

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, ProdutoImagem, RevelarDirective, VitrineCarrossel],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo {

  private produtoService = inject(ProdutoService);
  private categoriaService = inject(CategoriaService);
  private marcaService = inject(MarcaService);
  private carrinho = inject(CarrinhoService);
  auth = inject(AuthService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);

  // vêm da URL: /?busca=g2c&categoria=PISTOLA
  busca = input<string>();
  categoria = input<string>();
  idMarca = input<string>(); // vem do mega menu: /?categoria=PISTOLA&idMarca=3

  categorias = signal<Categoria[]>([]);
  marcas = signal<Marca[]>([]);
  produtos = signal<Produto[]>([]);
  // todos os produtos (para o banner, as categorias e as vitrines da página inicial)
  todos = signal<Produto[]>([]);

  // banner: vários destaques que trocam sozinhos
  destaques = computed(() => escolherDestaques(this.todos()));

  // um bloco grande por categoria de arma, com a foto de um produto dela
  blocosCategoria = computed(() => {
    const lista = ordenarVitrine(this.todos());
    return ORDEM_DESTAQUE
      .map((codigo) => lista.find((p) => p.categoria.codigo === codigo))
      .filter((p): p is Produto => !!p)
      .map((p) => ({ categoria: p.categoria, produto: p }));
  });

  pistolas = computed(() => ordenarVitrine(this.todos()).filter((p) => p.categoria.codigo === 'PISTOLA').slice(0, 12));
  kit = computed(() => ordenarVitrine(this.todos()).filter((p) => !ARMAS_E_MUNICAO.includes(p.categoria.codigo)).slice(0, 12));
  indice = signal(0);
  pausado = signal(false); // mouse em cima do banner = para de trocar
  destaque = computed(() => this.destaques()[this.indice()] ?? null);
  mouse = signal({ x: 0, y: 0 });

  adicionado = signal<number | null>(null); // produto que acabou de ir para o carrinho
  private timerAdicionado?: ReturnType<typeof setTimeout>;
  esqueletos = [1, 2, 3, 4, 5, 6, 7, 8]; // cards cinza enquanto carrega
  total = signal(0);
  pagina = signal(0);
  marca = signal<number | null>(null);
  carregando = signal(false);
  erro = signal('');

  moeda = moeda;

  filtrando = computed(() => !!(this.busca() || this.categoria() || this.marca()));
  // "Limpar" só aparece com marca ou busca; a categoria continua escolhida
  temFiltro = computed(() => !!(this.busca() || this.marca()));
  temMais = computed(() => this.produtos().length < this.total());
  nomeCategoria = computed(() => this.categorias().find((c) => c.codigo === this.categoria())?.nome ?? '');

  constructor() {
    this.categoriaService.listar().subscribe((lista) => this.categorias.set(lista));
    this.marcaService.listar('', 0, 100).subscribe((p) => this.marcas.set(p.items.filter((m) => m.ativa)));

    // produtos em destaque no banner do topo
    this.produtoService.listar({}, 0, 100).subscribe((p) => this.todos.set(p.items));

    // sempre que a busca, a categoria ou a marca da URL mudar, recarrega do começo
    effect(() => {
      this.busca();
      this.categoria();
      const marcaDaUrl = Number(this.idMarca());
      untracked(() => {
        // marca vem da URL (mega menu); trocar de categoria pelo menu tira o filtro de marca
        this.marca.set(marcaDaUrl || null);
        this.carregar(true);
      });
    });
  }

  carregar(doComeco: boolean): void {
    if (doComeco) this.pagina.set(0);
    this.carregando.set(true);
    this.erro.set('');

    const filtro = { nome: this.busca() ?? '', categoria: this.categoria() ?? null, idMarca: this.marca() };
    this.produtoService.listar(filtro, this.pagina(), POR_PAGINA).subscribe({
      next: (resposta) => {
        this.produtos.set(doComeco ? resposta.items : [...this.produtos(), ...resposta.items]);
        this.total.set(resposta.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('A loja não conseguiu falar com o servidor. Confira se o back-end está rodando.');
        this.carregando.set(false);
      },
    });
  }

  carregarMais(): void {
    this.pagina.update((p) => p + 1);
    this.carregar(false);
  }

  escolherCategoria(codigo: string | null): void {
    this.router.navigate(['/'], { queryParams: { busca: this.busca() || null, categoria: codigo } });
  }

  escolherMarca(id: number | null): void {
    this.marca.set(id);
    this.carregar(true);
  }

  // tira a marca e a busca, mas continua na categoria em que a pessoa está
  limpar(): void {
    this.marca.set(null);
    if (this.busca())
      this.router.navigate(['/'], { queryParams: { categoria: this.categoria() || null } });
    else
      this.carregar(true);
  }

  verTodos(): void {
    this.marca.set(null);
    this.router.navigate(['/']);
  }

  // ===== banner =====

  // chamado quando a barrinha de tempo do banner termina de encher
  proximo(): void {
    const quantidade = this.destaques().length;
    if (quantidade > 1) this.indice.update((i) => (i + 1) % quantidade);
  }

  anterior(): void {
    const quantidade = this.destaques().length;
    if (quantidade > 1) this.indice.update((i) => (i - 1 + quantidade) % quantidade);
  }

  irPara(posicao: number): void {
    this.indice.set(posicao);
  }

  // 1 -> "01" (contador do banner)
  numero(n: number): string {
    return String(n).padStart(2, '0');
  }

  // a foto do banner acompanha o mouse de leve (efeito de profundidade)
  // x e y vão de -1 a 1; sem mouse em cima, volta para o centro
  mexerMouse(evento: MouseEvent | null): void {
    if (!evento) {
      this.mouse.set({ x: 0, y: 0 });
      return;
    }
    const area = (evento.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouse.set({
      x: ((evento.clientX - area.left) / area.width) * 2 - 1,
      y: ((evento.clientY - area.top) / area.height) * 2 - 1,
    });
  }

  parcela(valor: number): string {
    return moeda(valor / 10);
  }

  adicionar(evento: Event, produto: Produto): void {
    evento.preventDefault();
    evento.stopPropagation();
    if (this.carrinho.adicionar(produto)) {
      this.notificacao.sucesso(`${produto.nome} foi para o carrinho.`);
      // o botão mostra "Adicionado" por um instante
      this.adicionado.set(produto.id);
      clearTimeout(this.timerAdicionado);
      this.timerAdicionado = setTimeout(() => this.adicionado.set(null), 1600);
    }
    else
      this.notificacao.erro(`Só há ${produto.estoque} unidade(s) de ${produto.nome}.`);
  }
}
