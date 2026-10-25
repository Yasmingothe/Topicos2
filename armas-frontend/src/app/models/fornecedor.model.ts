export interface Fornecedor {
  id: number;
  razaoSocial: string;
  nomeFantasia: string | null;
  cnpj: string;
  email: string | null;
  telefone: string | null;
  ativo: boolean;
}

export interface FornecedorRequest {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  email: string;
  telefone: string;
  ativo: boolean;
}
