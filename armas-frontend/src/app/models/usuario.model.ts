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

// resposta do login (os tokens são gerados pelo Keycloak, mas chegam pelo nosso back)
export interface TokenResponse {
  token: string;        // access token: vai no cabeçalho Authorization (vale poucos minutos)
  refreshToken: string; // usado para pedir um token novo sem digitar a senha de novo
  expiraEm: number;     // segundos de validade do access token
  usuario: Usuario;
}
