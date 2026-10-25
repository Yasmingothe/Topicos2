import { Opcao } from './opcao.model';
import { ProdutoResumo } from './produto.model';

export interface LoteUsado {
  idLote: number;
  codigo: string;
  quantidade: number;
}

export interface ItemPedido {
  id: number;
  produto: ProdutoResumo;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  lotes: LoteUsado[];
}

export interface Pedido {
  id: number;
  data: string;
  situacao: Opcao;
  formaPagamento: Opcao;
  parcelas: number;
  valorTotal: number;
  cliente: { id: number; nome: string; email: string; telefone: string; endereco: string };
  itens: ItemPedido[];
}

export interface PedidoRequest {
  formaPagamento: string;
  parcelas: number;
  itens: { idProduto: number; quantidade: number }[];
}
