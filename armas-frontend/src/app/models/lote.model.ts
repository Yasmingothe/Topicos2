import { Opcao } from './opcao.model';
import { ProdutoResumo } from './produto.model';

export interface Lote {
  id: number;
  codigo: string;
  produto: ProdutoResumo;
  dataEntrada: string;
  quantidadeInicial: number;
  quantidadeDisponivel: number;
  idNota: number;
  numeroNota: string;
  serieNota: string;
  fornecedor: string;
}

export interface SaidaRastreio {
  idPedido: number;
  dataPedido: string;
  situacaoPedido: Opcao;
  idCliente: number;
  nomeCliente: string;
  cpfCliente: string; // já vem com parte escondida
  quantidade: number;
}

export interface RastreioLote {
  lote: Lote;
  dataEmissaoNota: string;
  custoUnitario: number;
  quantidadeVendida: number;
  saidas: SaidaRastreio[];
}
