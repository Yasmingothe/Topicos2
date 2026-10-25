import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Pedido } from '../../../models/pedido.model';
import { MinhaContaService } from '../../../services/minha-conta.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { corSituacao, dataHora, moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';

@Component({
  selector: 'app-meus-pedidos',
  imports: [RouterLink, MatButtonModule, MatIconModule, ProdutoImagem],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css',
})
export class MeusPedidos implements OnInit {

  private minhaConta = inject(MinhaContaService);
  private notificacao = inject(NotificacaoService);

  pedidos = signal<Pedido[]>([]);
  carregando = signal(true);
  aberto = signal<number | null>(null);

  moeda = moeda;
  dataHora = dataHora;
  corSituacao = corSituacao;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.minhaConta.meusPedidos(0, 50).subscribe({
      next: (p) => {
        this.pedidos.set(p.items);
        this.carregando.set(false);
        if (p.items.length && this.aberto() === null) this.aberto.set(p.items[0].id);
      },
      error: () => this.carregando.set(false),
    });
  }

  alternar(id: number): void {
    this.aberto.set(this.aberto() === id ? null : id);
  }

  cancelar(pedido: Pedido): void {
    this.notificacao.confirmar({
      titulo: `Cancelar o pedido #${pedido.id}?`,
      mensagem: `O valor de ${moeda(pedido.valorTotal)} é estornado na mesma forma de pagamento.`,
      textoBotao: 'CANCELAR PEDIDO',
      icone: 'block',
    }).subscribe((confirmou) => {
      if (!confirmou) return;
      this.minhaConta.cancelarPedido(pedido.id).subscribe({
        next: () => {
          this.notificacao.sucesso(`Pedido #${pedido.id} cancelado.`);
          this.carregar();
        },
        error: (erro) => this.notificacao.erro(erro.error?.message ?? 'Não foi possível cancelar.'),
      });
    });
  }
}
