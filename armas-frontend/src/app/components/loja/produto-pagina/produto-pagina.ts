import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Produto } from '../../../models/produto.model';
import { AuthService } from '../../../services/auth.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { ProdutoService } from '../../../services/produto.service';
import { moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';

import { VoltarDirective } from '../../../directives/voltar.directive';

@Component({
  selector: 'app-produto-pagina',
  imports: [VoltarDirective, RouterLink, MatButtonModule, MatIconModule, ProdutoImagem],
  templateUrl: './produto-pagina.html',
  styleUrl: './produto-pagina.css',
})
export class ProdutoPagina implements OnInit {

  private produtoService = inject(ProdutoService);
  private carrinho = inject(CarrinhoService);
  auth = inject(AuthService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);

  id = input.required<string>();

  produto = signal<Produto | null>(null);
  quantidade = signal(1);
  erro = signal('');

  moeda = moeda;

  ngOnInit(): void {
    this.produtoService.buscarPorId(Number(this.id())).subscribe({
      next: (p) => this.produto.set(p),
      error: () => this.erro.set('Este produto não está disponível.'),
    });
  }

  mudarQuantidade(delta: number): void {
    const maximo = this.produto()?.estoque ?? 1;
    this.quantidade.update((q) => Math.max(1, Math.min(maximo, q + delta)));
  }

  adicionar(irParaCarrinho: boolean): void {
    const p = this.produto()!;
    if (!this.carrinho.adicionar(p, this.quantidade())) {
      this.notificacao.erro(`Você já tem o máximo disponível (${p.estoque} un.) no carrinho.`);
      return;
    }
    if (irParaCarrinho) {
      this.router.navigateByUrl('/carrinho');
    } else {
      this.notificacao.sucesso(`${this.quantidade()} × ${p.nome} no carrinho.`);
      this.quantidade.set(1);
    }
  }
}
