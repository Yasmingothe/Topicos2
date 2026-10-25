import { Opcao } from './opcao.model';

export interface Estado {
  id: number;
  nome: string;
  sigla: string;
}

export interface Municipio {
  id: number;
  nome: string;
  estado: Estado;
}

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: Municipio;
  idade: number;
  temConta: boolean;
  numeroAutorizacao: string | null;
  validadeAutorizacao: string | null;
  situacaoAutorizacao: Opcao;
  autorizacaoValida: boolean;
}

export interface AutorizacaoRequest {
  numero: string;
  validade: string;
}

export interface ClienteRequest {
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}