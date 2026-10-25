import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TokenResponse } from '../models/usuario.model';
import { API } from '../utils/api';

const CHAVE = 'zero1.sessao';

// guarda quem está logado (token + usuário) e avisa o sistema todo
@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);

  // signal = valor que, quando muda, atualiza as telas sozinho
  private sessao = signal<TokenResponse | null>(this.lerDoNavegador());

  usuario = computed(() => this.sessao()?.usuario ?? null);
  logado = computed(() => this.sessao() !== null);
  ehAdmin = computed(() => this.usuario()?.perfil.codigo === 'ADMIN');
  ehCliente = computed(() => this.usuario()?.perfil.codigo === 'CLIENTE');

  token(): string | null {
    return this.sessao()?.token ?? null;
  }

  login(email: string, senha: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${API}/auth/login`, { email, senha })
      .pipe(tap((resposta) => this.guardar(resposta)));
  }

  cadastrar(nome: string, email: string, senha: string): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${API}/auth/cadastro`, { nome, email, senha })
      .pipe(tap((resposta) => this.guardar(resposta)));
  }

  // quando o cliente muda o nome no perfil, atualiza aqui também
  atualizarNome(nome: string): void {
    const atual = this.sessao();
    if (!atual) return;
    this.guardar({ ...atual, usuario: { ...atual.usuario, nome } });
  }

  sair(): void {
    localStorage.removeItem(CHAVE);
    this.sessao.set(null);
  }

  private guardar(resposta: TokenResponse): void {
    localStorage.setItem(CHAVE, JSON.stringify(resposta));
    this.sessao.set(resposta);
  }

  // ao abrir o site, recupera a sessão salva (se o token ainda não venceu)
  private lerDoNavegador(): TokenResponse | null {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (!salvo) return null;

      const sessao = JSON.parse(salvo) as TokenResponse;
      if (this.tokenVencido(sessao.token)) {
        localStorage.removeItem(CHAVE);
        return null;
      }
      return sessao;
    } catch {
      return null;
    }
  }

  // o token JWT tem 3 partes separadas por ponto; a do meio guarda a validade ("exp")
  private tokenVencido(token: string): boolean {
    try {
      const conteudo = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return !conteudo.exp || conteudo.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
