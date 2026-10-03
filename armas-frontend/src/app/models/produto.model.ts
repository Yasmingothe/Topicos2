import { Categoria } from './categoria.model';
import { Marca } from './marca.model';

export interface Produto {
  id: number;
  nome: string;
  marca: Marca;
  categoria: Categoria;
  calibre: string | null;
  preco: number;
  estoque: number;
  descricao: string | null;
  publicado: boolean;
}

export interface ProdutoRequest {
  nome: string;
  idMarca: number;
  categoria: string;
  calibre: string;
  preco: number;
  estoque: number;
  descricao: string;
  publicado: boolean;
}