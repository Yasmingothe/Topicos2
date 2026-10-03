import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Categoria } from '../../../models/categoria.model';
import { Marca } from '../../../models/marca.model';
import { Produto } from '../../../models/produto.model';
import { CategoriaService } from '../../../services/categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { ProdutoService } from '../../../services/produto.service';

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

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');

    const filtro = {
      nome: this.filtroNome(),
      idMarca: this.filtroMarca(),
      categoria: this.filtroCategoria(),
    };

    this.produtoService.listar(filtro, this.pageIndex(), this.pageSize()).subscribe({
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

  excluir(produto: Produto): void {
    if (!confirm(`Deseja excluir o produto "${produto.nome}"?`))
      return;

    this.produtoService.excluir(produto.id).subscribe({
      next: () => {
        if (this.produtos().length === 1 && this.pageIndex() > 0)
          this.pageIndex.update((pagina) => pagina - 1);
        this.carregar();
      },
      error: (erro) => alert(erro.error?.message ?? 'Não foi possível excluir o produto.'),
    });
  }
}