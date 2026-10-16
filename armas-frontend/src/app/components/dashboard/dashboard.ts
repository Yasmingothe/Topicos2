import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Produto } from '../../models/produto.model';
import { Cliente } from '../../models/cliente.model';
import { ProdutoService } from '../../services/produto.service';
import { MarcaService } from '../../services/marca.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private produtoService = inject(ProdutoService);
  private marcaService = inject(MarcaService);
  private clienteService = inject(ClienteService);

  produtos = signal<Produto[]>([]);
  clientes = signal<Cliente[]>([]);
  totalMarcas = signal(0);
  totalClientes = signal(0);
  erro = signal('');

  private moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  // ===== contas feitas com a lista de produtos =====
  valorEstoque = computed(() =>
    this.produtos().reduce((soma, p) => soma + p.preco * p.estoque, 0));

  publicados = computed(() => this.produtos().filter((p) => p.publicado).length);

  // estoque baixo = 6 unidades ou menos, do menor para o maior
  estoqueBaixo = computed(() =>
    this.produtos().filter((p) => p.estoque <= 6).sort((a, b) => a.estoque - b.estoque));

  // quantos produtos tem em cada categoria (para as barras)
  porCategoria = computed(() => {
    const contagem = new Map<string, number>();
    for (const p of this.produtos())
      contagem.set(p.categoria.nome, (contagem.get(p.categoria.nome) ?? 0) + 1);

    const maior = Math.max(1, ...contagem.values());
    return [...contagem.entries()]
      .map(([nome, qtd]) => ({ nome, qtd, largura: (qtd / maior) * 100 }))
      .sort((a, b) => b.qtd - a.qtd);
  });

  ngOnInit(): void {
    // forkJoin = faz as 3 buscas ao mesmo tempo e espera todas terminarem
    forkJoin({
      produtos: this.produtoService.listar({}, 0, 200),
      marcas: this.marcaService.listar('', 0, 1),
      clientes: this.clienteService.listar('', 0, 4),
    }).subscribe({
      next: (r) => {
        this.produtos.set(r.produtos.items);
        this.totalMarcas.set(r.marcas.totalItems);
        this.clientes.set(r.clientes.items);
        this.totalClientes.set(r.clientes.totalItems);
      },
      error: () => this.erro.set('Não foi possível carregar o dashboard. O back-end está rodando?'),
    });
  }

  formatarPreco(valor: number): string {
    return this.moeda.format(valor);
  }
}