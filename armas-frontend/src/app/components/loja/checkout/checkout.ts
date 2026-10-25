import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Cliente } from '../../../models/cliente.model';
import { ErroApi } from '../../../models/erro-api.model';
import { Pedido } from '../../../models/pedido.model';
import { CarrinhoService } from '../../../services/carrinho.service';
import { MinhaContaService } from '../../../services/minha-conta.service';
import { moeda } from '../../../utils/formatar';

type Forma = 'PIX' | 'CARTAO_CREDITO' | 'BOLETO';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  carrinho = inject(CarrinhoService);
  private minhaConta = inject(MinhaContaService);
  private fb = inject(FormBuilder);

  cliente = signal<Cliente | null>(null);
  carregando = signal(true);
  forma = signal<Forma>('PIX');
  enviando = signal(false);
  erroCompra = signal('');
  pedidoFeito = signal<Pedido | null>(null);

  moeda = moeda;

  formas: { codigo: Forma; nome: string; icone: string; detalhe: string }[] = [
    { codigo: 'PIX', nome: 'PIX', icone: 'qr_code_2', detalhe: 'Aprovação na hora' },
    { codigo: 'CARTAO_CREDITO', nome: 'Cartão de crédito', icone: 'credit_card', detalhe: 'Até 10x sem juros' },
    { codigo: 'BOLETO', nome: 'Boleto', icone: 'receipt', detalhe: 'Vence em 3 dias úteis' },
  ];

  // cartão SIMULADO: os números ficam só nesta tela, nunca vão para o back
  cartao = this.fb.nonNullable.group({
    numero: ['', [Validators.required, Validators.pattern(/^[\d ]{16,19}$/)]],
    nome: ['', [Validators.required, Validators.minLength(3)]],
    validade: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    parcelas: [1],
  });

  parcelas = computed(() => Array.from({ length: 10 }, (_, i) => i + 1));

  // ===== conferência antes de mandar (o back confere de novo) =====
  problemaControlado = computed(() => {
    const c = this.cliente();
    if (!this.carrinho.temControlado() || !c) return '';
    if (c.idade < 25) return `Você tem ${c.idade} anos. Armas e munições só podem ser vendidas para maiores de 25.`;
    if (!c.autorizacaoValida) {
      if (c.situacaoAutorizacao.codigo === 'EM_ANALISE') return 'Sua autorização de compra ainda está em análise pela loja.';
      if (c.situacaoAutorizacao.codigo === 'RECUSADA') return 'Sua autorização de compra foi recusada. Envie uma nova em Minha conta.';
      if (c.situacaoAutorizacao.codigo === 'APROVADA') return 'Sua autorização de compra venceu. Envie a nova em Minha conta.';
      return 'Você ainda não enviou sua autorização de compra.';
    }
    return '';
  });

  ngOnInit(): void {
    this.minhaConta.meusDados().subscribe({
      next: (c) => {
        this.cliente.set(c);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  finalizar(): void {
    if (this.forma() === 'CARTAO_CREDITO' && this.cartao.invalid) {
      this.cartao.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    this.erroCompra.set('');

    this.minhaConta.finalizarCompra({
      formaPagamento: this.forma(),
      parcelas: this.forma() === 'CARTAO_CREDITO' ? this.cartao.controls.parcelas.value : 1,
      itens: this.carrinho.itens().map((i) => ({ idProduto: i.idProduto, quantidade: i.quantidade })),
    }).subscribe({
      next: (pedido) => {
        this.carrinho.limpar();
        this.pedidoFeito.set(pedido);
        this.enviando.set(false);
        window.scrollTo({ top: 0 });
      },
      error: (erro: HttpErrorResponse) => {
        // aqui aparece a regra do back: "produto controlado...", "estoque insuficiente..."
        this.erroCompra.set((erro.error as ErroApi | null)?.message ?? 'Não foi possível finalizar a compra.');
        this.enviando.set(false);
      },
    });
  }

  // formata o número do cartão em blocos de 4 enquanto digita
  formatarNumero(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const numeros = campo.value.replace(/\D/g, '').substring(0, 16);
    this.cartao.controls.numero.setValue(numeros.replace(/(\d{4})(?=\d)/g, '$1 '));
  }
}
