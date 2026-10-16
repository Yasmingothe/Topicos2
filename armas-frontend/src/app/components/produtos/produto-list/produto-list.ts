import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Categoria } from '../../../models/categoria.model';
import { Marca } from '../../../models/marca.model';
import { Produto } from '../../../models/produto.model';
import { CategoriaService } from '../../../services/categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { ProdutoService } from '../../../services/produto.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { ProdutoDetalhe } from '../produto-detalhe/produto-detalhe';
import { exportarCsv } from '../../../utils/exportar-csv';

@Component({
  selector: 'app-produto-list',
  imports: [
    RouterLink, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
  ],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.css',
})
export class ProdutoList implements OnInit {

  private produtoService = inject(ProdutoService);
  private marcaService = inject(MarcaService);
  private categoriaService = inject(CategoriaService);
  private dialog = inject(MatDialog);
  private notificacao = inject(NotificacaoService);

  colunas = ['nome', 'marca', 'categoria', 'preco', 'estoque', 'situacao', 'acoes'];

  produtos = signal<Produto[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(5);
  carregando = signal(false);
  erro = signal('');

  marcas = signal<Marca[]>([]);
  categorias = signal<Categoria[]>([]);

  filtroNome = signal('');
  filtroMarca = signal<number | null>(null);
  filtroCategoria = signal<string | null>(null);

  private moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  ngOnInit(): void {
    this.marcaService.listar('', 0, 100).subscribe((pagina) => this.marcas.set(pagina.items));
    this.categoriaService.listar().subscribe((lista) => this.categorias.set(lista));

    this.carregar();
  }

  // junta os 3 filtros num objeto só
  private filtroAtual() {
    return {
      nome: this.filtroNome(),
      idMarca: this.filtroMarca(),
      categoria: this.filtroCategoria(),
    };
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.produtoService.listar(this.filtroAtual(), this.pageIndex(), this.pageSize()).subscribe({
      next: (pagina) => {
        this.produtos.set(pagina.items);
        this.totalItems.set(pagina.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os produtos. O back-end está rodando?');
        this.carregando.set(false);
      },
    });
  }

  buscarPorNome(texto: string): void {
    this.filtroNome.set(texto);
    this.recarregarDoInicio();
  }

  filtrarPorMarca(idMarca: number | null): void {
    this.filtroMarca.set(idMarca);
    this.recarregarDoInicio();
  }

  filtrarPorCategoria(codigo: string | null): void {
    this.filtroCategoria.set(codigo);
    this.recarregarDoInicio();
  }

  // ===== LIMPAR =====
  temFiltro(): boolean {
    return !!(this.filtroNome() || this.filtroMarca() || this.filtroCategoria());
  }

  limparFiltros(): void {
    this.filtroNome.set('');
    this.filtroMarca.set(null);
    this.filtroCategoria.set(null);
    this.recarregarDoInicio();
  }

  private recarregarDoInicio(): void {
    this.pageIndex.set(0);
    this.carregar();
  }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  formatarPreco(valor: number): string {
    return this.moeda.format(valor);
  }

  // ===== EXPORTAR =====
  exportar(): void {
    this.produtoService.listar(this.filtroAtual(), 0, Math.max(this.totalItems(), 1)).subscribe({
      next: (pagina) => {
        exportarCsv(
          'produtos',
          ['Código', 'Produto', 'Marca', 'Categoria', 'Calibre', 'Preço', 'Estoque', 'Situação'],
          pagina.items.map((p) => [
            p.id,
            p.nome,
            p.marca.nome,
            p.categoria.nome,
            p.calibre ?? '',
            p.preco.toFixed(2).replace('.', ','),
            p.estoque,
            p.publicado ? 'Publicado' : 'Rascunho',
          ]),
        );
        this.notificacao.sucesso(`${pagina.items.length} produto(s) exportado(s).`);
      },
      error: () => this.notificacao.erro('Não foi possível exportar os produtos.'),
    });
  }
   
  abrirDetalhes(produto: Produto): void {
    this.dialog.open(ProdutoDetalhe, {
      data: produto,
      width: '520px',
      panelClass: 'janela-produto',
    })
      .afterClosed().subscribe(() => this.carregar());
  }
  
  // ===== EXCLUIR (com a janela de confirmação nova) =====
  excluir(produto: Produto): void {
    this.notificacao.confirmar({
      titulo: 'Excluir produto?',
      mensagem: `"${produto.nome}" será removido do catálogo. Essa ação não pode ser desfeita.`,
    }).subscribe((confirmou) => {
      if (!confirmou)
        return;

      this.produtoService.excluir(produto.id).subscribe({
        next: () => {
          this.notificacao.sucesso('Produto excluído com sucesso.');
          if (this.produtos().length === 1 && this.pageIndex() > 0)
            this.pageIndex.update((pagina) => pagina - 1);
          this.carregar();
        },
        error: (erro) => this.notificacao.erro(erro.error?.message ?? 'Não foi possível excluir o produto.'),
      });
    });
  }
}