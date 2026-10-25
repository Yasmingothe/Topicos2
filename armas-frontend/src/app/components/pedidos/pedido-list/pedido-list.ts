import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Pedido } from '../../../models/pedido.model';
import { OpcaoService } from '../../../services/opcao.service';
import { PedidoService } from '../../../services/pedido.service';
import { corSituacao, dataHora, moeda } from '../../../utils/formatar';

@Component({
  selector: 'app-pedido-list',
  imports: [AsyncPipe, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule],
  templateUrl: './pedido-list.html',
})
export class PedidoList implements OnInit {

  private pedidoService = inject(PedidoService);
  private router = inject(Router);
  opcoes = inject(OpcaoService);

  colunas = ['numero', 'cliente', 'itens', 'pagamento', 'valor', 'situacao'];

  pedidos = signal<Pedido[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  filtroCliente = signal('');
  filtroSituacao = signal<string | null>(null);
  carregando = signal(false);
  erro = signal('');

  dataHora = dataHora;
  moeda = moeda;
  corSituacao = corSituacao;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.pedidoService.listar(this.filtroCliente(), this.filtroSituacao(), this.pageIndex(), this.pageSize()).subscribe({
      next: (pagina) => {
        this.pedidos.set(pagina.items);
        this.totalItems.set(pagina.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os pedidos. O back-end está rodando?');
        this.carregando.set(false);
      },
    });
  }

  buscar(texto: string): void { this.filtroCliente.set(texto); this.pageIndex.set(0); this.carregar(); }
  filtrarSituacao(s: string | null): void { this.filtroSituacao.set(s); this.pageIndex.set(0); this.carregar(); }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  abrir(pedido: Pedido): void {
    this.router.navigate(['/admin/pedidos', pedido.id]);
  }

  unidades(pedido: Pedido): number {
    return pedido.itens.reduce((soma, i) => soma + i.quantidade, 0);
  }
}
