import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Pedido } from '../../../models/pedido.model';
import { NotificacaoService } from '../../../services/notificacao.service';
import { PedidoService } from '../../../services/pedido.service';
import { corSituacao, dataHora, moeda, telefone } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';

// caminho normal de um pedido (é uma sequência, por isso tem ordem)
const ETAPAS = [
  { codigo: 'PAGO', nome: 'Pago' },
  { codigo: 'SEPARANDO', nome: 'Em separação' },
  { codigo: 'PRONTO_RETIRADA', nome: 'Pronto para retirada' },
  { codigo: 'ENTREGUE', nome: 'Entregue' },
];

import { VoltarDirective } from '../../../directives/voltar.directive';

@Component({
  selector: 'app-pedido-detalhe',
  imports: [VoltarDirective, RouterLink, MatButtonModule, MatIconModule, ProdutoImagem],
  templateUrl: './pedido-detalhe.html',
  styleUrl: './pedido-detalhe.css',
})
export class PedidoDetalhe implements OnInit {

  private pedidoService = inject(PedidoService);
  private notificacao = inject(NotificacaoService);

  id = input.required<string>();

  pedido = signal<Pedido | null>(null);
  erro = signal('');
  salvando = signal(false);

  etapas = ETAPAS;
  dataHora = dataHora;
  moeda = moeda;
  telefone = telefone;
  corSituacao = corSituacao;

  indiceAtual = computed(() => ETAPAS.findIndex((e) => e.codigo === this.pedido()?.situacao.codigo));
  proxima = computed(() => {
    const i = this.indiceAtual();
    return i >= 0 && i < ETAPAS.length - 1 ? ETAPAS[i + 1] : null;
  });
  encerrado = computed(() => ['ENTREGUE', 'CANCELADO'].includes(this.pedido()?.situacao.codigo ?? ''));

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.pedidoService.buscarPorId(Number(this.id())).subscribe({
      next: (p) => this.pedido.set(p),
      error: () => this.erro.set('Pedido não encontrado.'),
    });
  }

  avancar(): void {
    const proxima = this.proxima();
    if (proxima) this.mudar(proxima.codigo, `Pedido marcado como "${proxima.nome}".`);
  }

  cancelar(): void {
    this.notificacao.confirmar({
      titulo: 'Cancelar este pedido?',
      mensagem: 'As unidades voltam para os mesmos lotes de onde saíram. Essa ação não pode ser desfeita.',
      textoBotao: 'CANCELAR PEDIDO',
      icone: 'block',
    }).subscribe((confirmou) => {
      if (confirmou) this.mudar('CANCELADO', 'Pedido cancelado e estoque devolvido aos lotes.');
    });
  }

  private mudar(situacao: string, mensagem: string): void {
    this.salvando.set(true);
    this.pedidoService.alterarSituacao(this.pedido()!.id, situacao).subscribe({
      next: () => {
        this.notificacao.sucesso(mensagem);
        this.salvando.set(false);
        this.carregar();
      },
      error: (erro) => {
        this.notificacao.erro(erro.error?.message ?? 'Não foi possível alterar o pedido.');
        this.salvando.set(false);
      },
    });
  }
}
