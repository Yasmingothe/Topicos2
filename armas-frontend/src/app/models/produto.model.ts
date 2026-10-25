import { Categoria } from './categoria.model';
import { Marca } from './marca.model';

export interface Produto {
  id: number;
  nome: string;
  marca: Marca;
  categoria: Categoria;
  calibre: string | null;
  preco: number;
  estoque: number; // só leitura: muda pela nota de entrada e pela venda
  descricao: string | null;
  publicado: boolean;
  temImagem: boolean;        // tem arquivo de foto enviado
  imagemUrl: string | null;  // ou um link de foto na internet
}

// versão curta, usada dentro de nota, lote e pedido
export interface ProdutoResumo {
  id: number;
  nome: string;
  categoria: Categoria;
  calibre: string | null;
  temImagem: boolean;
  imagemUrl: string | null;
}

export interface ProdutoRequest {
  nome: string;
  idMarca: number;
  categoria: string;
  calibre: string;
  preco: number;
  descricao: string;
  publicado: boolean;
  imagemUrl: string;
}
