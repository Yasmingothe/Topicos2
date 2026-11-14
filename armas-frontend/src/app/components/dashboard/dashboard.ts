import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Produto } from '../../models/produto.model';
import { Cliente } from '../../models/cliente.model';
import { Pedido } from '../../models/pedido.model';
import { ResumoDashboard } from '../../models/dashboard.model';
import { ProdutoService } from '../../services/produto.service';
import { MarcaService } from '../../services/marca.service';
import { ClienteService } from '../../services/cliente.service';
import { DashboardService } from '../../services/dashboard.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { corSituacao, dataHora, moeda } from '../../utils/formatar';
import { ProdutoImagem } from '../shared/produto-imagem';
import { ESTOQUE_BAIXO } from '../../utils/estoque';

type FiltroEstoque = 'todos' | 'baixo' | 'zerado' | 'rascunho';
type CampoOrdem = 'nome' | 'categoria' | 'preco' | 'estoque';

const POR_VEZ = 8;       // quantas linhas aparecem de cada vez

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule, MatButtonModule, ProdutoImagem],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private produtoService = inject(ProdutoService);
  private marcaService = inject(MarcaService);
  private clienteService = inject(ClienteService);
  private dashboardService = inject(DashboardService);
  private pedidoService = inject(PedidoService);
  auth = inject(AuthService);

  produtos = signal<Produto[]>([]);
  clientes = signal<Cliente[]>([]);
  pedidos = signal<Pedido[]>([]);
  resumo = signal<ResumoDashboard | null>(null);
  totalMarcas = signal(0);
  totalClientes = signal(0);
  erro = signal('');

  moeda = moeda;
  dataHora = dataHora;
  corSituacao = corSituacao;

  primeiroNome = computed(() => (this.auth.usuario()?.nome ?? '').split(' ')[0]);

  // ===== contas feitas com a lista de produtos =====
  valorEstoque = computed(() =>
    this.produtos().reduce((soma, p) => soma + p.preco * p.estoque, 0));

  publicados = computed(() => this.produtos().filter((p) => p.publicado).length);

  unidadesEmEstoque = computed(() => this.produtos().reduce((soma, p) => soma + p.estoque, 0));

  // estoque baixo (ver utils/estoque.ts), do menor para o maior
  estoqueBaixo = computed(() =>
    this.produtos().filter((p) => p.estoque <= ESTOQUE_BAIXO).sort((a, b) => a.estoque - b.estoque));

  // unidades e valor em estoque de cada categoria (para as barras)
  porCategoria = computed(() => {
    const grupos = new Map<string, { nome: string; unidades: number; valor: number }>();
    for (const p of this.produtos()) {
      const g = grupos.get(p.categoria.codigo) ?? { nome: p.categoria.nome, unidades: 0, valor: 0 };
      g.unidades += p.estoque;
      g.valor += p.estoque * p.preco;
      grupos.set(p.categoria.codigo, g);
    }
    const maior = Math.max(1, ...[...grupos.values()].map((g) => g.unidades));
    return [...grupos.values()]
      .map((g) => ({ ...g, largura: (g.unidades / maior) * 100 }))
      .sort((a, b) => b.unidades - a.unidades);
  });

  // ===== lista de produtos (busca, filtro e ordem) =====
  busca = signal('');
  filtro = signal<FiltroEstoque>('todos');
  ordem = signal<{ campo: CampoOrdem; crescente: boolean }>({ campo: 'nome', crescente: true }); // começa em ordem alfabética
  quantosMostrar = signal(POR_VEZ);

  // números que aparecem nos botões de filtro
  contagens = computed(() => {
    const lista = this.produtos();
    return {
      todos: lista.length,
      baixo: lista.filter((p) => p.estoque > 0 && p.estoque <= ESTOQUE_BAIXO).length,
      zerado: lista.filter((p) => p.estoque === 0).length,
      rascunho: lista.filter((p) => !p.publicado).length,
    };
  });

  listaFiltrada = computed(() => {
    const texto = this.busca().trim().toLowerCase();
    const filtro = this.filtro();
    const { campo, crescente } = this.ordem();

    const lista = this.produtos().filter((p) => {
      if (filtro === 'baixo' && !(p.estoque > 0 && p.estoque <= ESTOQUE_BAIXO)) return false;
      if (filtro === 'zerado' && p.estoque !== 0) return false;
      if (filtro === 'rascunho' && p.publicado) return false;
      if (!texto) return true;
      return [p.nome, p.marca.nome, p.categoria.nome, p.calibre ?? '']
        .some((parte) => parte.toLowerCase().includes(texto));
    });

    const sinal = crescente ? 1 : -1;
    return lista.sort((a, b) => {
      if (campo === 'nome') return a.nome.localeCompare(b.nome) * sinal;
      if (campo === 'categoria') return a.categoria.nome.localeCompare(b.categoria.nome) * sinal;
      return (a[campo] - b[campo]) * sinal;
    });
  });

  visiveis = computed(() => this.listaFiltrada().slice(0, this.quantosMostrar()));

  escolherFiltro(filtro: FiltroEstoque): void {
    this.filtro.set(filtro);
    this.quantosMostrar.set(POR_VEZ);
  }

  pesquisar(texto: string): void {
    this.busca.set(texto);
    this.quantosMostrar.set(POR_VEZ);
  }

  // clicar no título da coluna ordena; clicar de novo inverte
  ordenarPor(campo: CampoOrdem): void {
    const atual = this.ordem();
    this.ordem.set({ campo, crescente: atual.campo === campo ? !atual.crescente : true });
  }

  setaOrdem(campo: CampoOrdem): string {
    const atual = this.ordem();
    if (atual.campo !== campo) return '';
    return atual.crescente ? 'arrow_upward' : 'arrow_downward';
  }

  mostrarMais(): void {
    this.quantosMostrar.update((n) => n + POR_VEZ);
  }

  esBaixo = ESTOQUE_BAIXO; // para usar no HTML

  // barrinha de estoque: cheia com 30 unidades ou mais
  nivelEstoque(estoque: number): number {
    return Math.min(100, (estoque / 30) * 100);
  }

  situacao(p: Produto): { texto: string; cor: string } {
    if (!p.publicado) return { texto: 'Rascunho', cor: '' };
    if (p.estoque === 0) return { texto: 'Sem estoque', cor: 'vermelho' };
    if (p.estoque <= ESTOQUE_BAIXO) return { texto: 'Estoque baixo', cor: 'laranja' };
    return { texto: 'À venda', cor: 'verde' };
  }

  ngOnInit(): void {
    // forkJoin = faz as buscas ao mesmo tempo e espera todas terminarem
    forkJoin({
      produtos: this.produtoService.listar({}, 0, 500),
      marcas: this.marcaService.listar('', 0, 1),
      clientes: this.clienteService.listar('', 0, 4),
      resumo: this.dashboardService.resumo(),
      pedidos: this.pedidoService.listar('', null, 0, 6),
    }).subscribe({
      next: (r) => {
        this.produtos.set(r.produtos.items);
        this.totalMarcas.set(r.marcas.totalItems);
        this.clientes.set(r.clientes.items);
        this.totalClientes.set(r.clientes.totalItems);
        this.resumo.set(r.resumo);
        this.pedidos.set(r.pedidos.items);
      },
      error: () => this.erro.set('Não foi possível carregar o dashboard. O back-end está rodando?'),
    });
  }

  formatarPreco(valor: number): string {
    return moeda(valor);
  }
}
