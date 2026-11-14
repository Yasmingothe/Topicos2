import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Lote, RastreioLote } from '../../../models/lote.model';
import { Produto } from '../../../models/produto.model';
import { LoteService } from '../../../services/lote.service';
import { ProdutoService } from '../../../services/produto.service';
import { corSituacao, data, dataHora, moeda } from '../../../utils/formatar';
import { FiltroMenu } from '../../shared/filtro-menu';

// rastreio: escolhe um lote e vê a "história" dele (de onde veio, para quem foi)
@Component({
  selector: 'app-lote-rastreio',
  imports: [FiltroMenu, 
    RouterLink, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatSlideToggleModule,
  ],
  templateUrl: './lote-rastreio.html',
  styleUrl: './lote-rastreio.css',
})
export class LoteRastreio implements OnInit {

  private loteService = inject(LoteService);
  private produtoService = inject(ProdutoService);

  lote = input<string>();    // /admin/lotes?lote=5 abre o rastreio direto
  produto = input<string>(); // /admin/lotes?produto=1 já filtra

  colunas = ['codigo', 'produto', 'nota', 'saldo'];

  lotes = signal<Lote[]>([]);
  produtos = signal<Produto[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  filtroCodigo = signal('');
  filtroProduto = signal<number | null>(null);
  somenteComSaldo = signal(false);
  carregando = signal(false);
  erro = signal('');

  rastreio = signal<RastreioLote | null>(null);
  carregandoRastreio = signal(false);

  data = data;
  dataHora = dataHora;
  moeda = moeda;
  corSituacao = corSituacao;

  ngOnInit(): void {
    this.produtoService.listar({}, 0, 500).subscribe((p) => this.produtos.set(p.items));
    if (this.produto()) this.filtroProduto.set(Number(this.produto()));
    if (this.lote()) this.abrir(Number(this.lote()));
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    const filtro = { codigo: this.filtroCodigo(), idProduto: this.filtroProduto(), comSaldo: this.somenteComSaldo() };
    this.loteService.listar(filtro, this.pageIndex(), this.pageSize()).subscribe({
      next: (pagina) => {
        this.lotes.set(pagina.items);
        this.totalItems.set(pagina.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os lotes. O back-end está rodando?');
        this.carregando.set(false);
      },
    });
  }

  buscar(texto: string): void { this.filtroCodigo.set(texto); this.recarregar(); }
  filtrarProduto(id: number | null): void { this.filtroProduto.set(id); this.recarregar(); }
  alternarSaldo(valor: boolean): void { this.somenteComSaldo.set(valor); this.recarregar(); }

  private recarregar(): void {
    this.pageIndex.set(0);
    this.carregar();
  }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  abrir(id: number): void {
    this.carregandoRastreio.set(true);
    this.loteService.rastrear(id).subscribe({
      next: (r) => {
        this.rastreio.set(r);
        this.carregandoRastreio.set(false);
      },
      error: () => {
        this.rastreio.set(null);
        this.carregandoRastreio.set(false);
        this.erro.set('Lote não encontrado.');
      },
    });
  }

  fechar(): void {
    this.rastreio.set(null);
  }
}
