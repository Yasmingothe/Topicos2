import { Opcao } from './opcao.model';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: Opcao; // ADMIN ou CLIENTE
  ativo: boolean;
  dataCadastro: string;
}

export interface UsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  perfil: string;
}

export interface TokenResponse {
  token: string;
  usuario: Usuario;
}
