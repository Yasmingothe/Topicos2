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

const POR_PAGINA = 12;

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatFormFieldModule, MatSelectModule, ProdutoImagem],
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

  categorias = signal<Categoria[]>([]);
  marcas = signal<Marca[]>([]);
  produtos = signal<Produto[]>([]);
  destaque = signal<Produto | null>(null);
  total = signal(0);
  pagina = signal(0);
  marca = signal<number | null>(null);
  carregando = signal(false);
  erro = signal('');

  moeda = moeda;

  filtrando = computed(() => !!(this.busca() || this.categoria() || this.marca()));
  temMais = computed(() => this.produtos().length < this.total());
  nomeCategoria = computed(() => this.categorias().find((c) => c.codigo === this.categoria())?.nome ?? '');

  constructor() {
    this.categoriaService.listar().subscribe((lista) => this.categorias.set(lista));
    this.marcaService.listar('', 0, 100).subscribe((p) => this.marcas.set(p.items.filter((m) => m.ativa)));

    // produto em destaque no topo: a primeira pistola com estoque, de preferência com foto
    this.produtoService.listar({ categoria: 'PISTOLA' }, 0, 20).subscribe((p) => {
      const comEstoque = p.items.filter((x) => x.estoque > 0);
      const comFoto = comEstoque.find((x) => x.temImagem || x.imagemUrl);
      this.destaque.set(comFoto ?? comEstoque[0] ?? p.items[0] ?? null);
    });

    // sempre que a busca ou a categoria da URL mudar, recarrega do começo
    effect(() => {
      this.busca();
      this.categoria();
      untracked(() => this.carregar(true));
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

  limpar(): void {
    this.marca.set(null);
    this.router.navigate(['/']);
  }

  parcela(valor: number): string {
    return moeda(valor / 10);
  }

  adicionar(evento: Event, produto: Produto): void {
    evento.preventDefault();
    evento.stopPropagation();
    if (this.carrinho.adicionar(produto))
      this.notificacao.sucesso(`${produto.nome} foi para o carrinho.`);
    else
      this.notificacao.erro(`Só há ${produto.estoque} unidade(s) de ${produto.nome}.`);
  }
}
