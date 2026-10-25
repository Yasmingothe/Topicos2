import { Fornecedor } from './fornecedor.model';
import { ProdutoResumo } from './produto.model';

export interface ItemNotaEntrada {
  id: number;
  produto: ProdutoResumo;
  quantidade: number;
  custoUnitario: number;
  subtotal: number;
  idLote: number;
  codigoLote: string;
  quantidadeDisponivel: number;
}

export interface NotaEntrada {
  id: number;
  numero: string;
  serie: string;
  fornecedor: Fornecedor;
  dataEmissao: string;
  dataEntrada: string;
  observacao: string | null;
  valorTotal: number;
  quantidadeTotal: number;
  podeExcluir: boolean;
  itens: ItemNotaEntrada[];
}

export interface ItemNotaEntradaRequest {
  idProduto: number;
  quantidade: number;
  custoUnitario: number;
  codigoLote: string;
}

export interface NotaEntradaRequest {
  numero: string;
  serie: string;
  idFornecedor: number;
  dataEmissao: string;
  dataEntrada: string;
  observacao: string;
  itens: ItemNotaEntradaRequest[];
}
