import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, shareReplay, tap, throwError } from 'rxjs';
import { TokenResponse, Usuario } from '../models/usuario.model';
import { API } from '../utils/api';

const CHAVE = 'zero1.sessao';

// guarda quem está logado (tokens + usuário) e avisa o sistema todo.
// IMPORTANTE: o Angular NUNCA chama o Keycloak direto; tudo passa pelo back (/auth/...)
@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);

  // signal = valor que, quando muda, atualiza as telas sozinho
  private sessao = signal<TokenResponse | null>(this.lerDoNavegador());

  // renovação em andamento (se 3 requisições derem 401 juntas, renova uma vez só)
  private renovando$: Observable<TokenResponse> | null = null;

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

  // o access token venceu: o back pede ao Keycloak um novo usando o refresh token
  renovar(): Observable<TokenResponse> {
    const refreshToken = this.sessao()?.refreshToken;
    if (!refreshToken) return throwError(() => new Error('Sem sessão para renovar.'));

    if (!this.renovando$) {
      this.renovando$ = this.http
        .post<TokenResponse>(`${API}/auth/renovar`, { refreshToken })
        .pipe(
          tap((resposta) => this.guardar(resposta)),
          finalize(() => (this.renovando$ = null)),
          shareReplay(1),
        );
    }
    return this.renovando$;
  }

  // ao abrir o site: pergunta ao back "quem sou eu?" para conferir a sessão e atualizar nome/perfil
  conferirSessao(): void {
    if (!this.logado()) return;
    this.http.get<Usuario>(`${API}/auth/eu`).subscribe({
      next: (usuario) => {
        const atual = this.sessao();
        if (atual) this.guardar({ ...atual, usuario });
      },
      error: () => {}, // 401: o interceptor já tenta renovar ou manda para o login
    });
  }

  // "Esqueci minha senha": o back manda um link por e-mail
  esqueciSenha(email: string): Observable<void> {
    return this.http.post<void>(`${API}/auth/esqueci-senha`, { email });
  }

  // tela aberta pelo link do e-mail: manda o código do link e a senha nova
  redefinirSenha(token: string, novaSenha: string): Observable<void> {
    return this.http.post<void>(`${API}/auth/redefinir-senha`, { token, novaSenha });
  }

  // trocar a senha estando logado (o back confere a atual e troca no Keycloak)
  alterarSenha(senhaAtual: string, novaSenha: string): Observable<void> {
    return this.http.put<void>(`${API}/auth/senha`, { senhaAtual, novaSenha });
  }

  // quando o cliente muda o nome no perfil, atualiza aqui também
  atualizarNome(nome: string): void {
    const atual = this.sessao();
    if (!atual) return;
    this.guardar({ ...atual, usuario: { ...atual.usuario, nome } });
  }

  // logout: avisa o back (que encerra a sessão no Keycloak) e limpa o navegador
  sair(): void {
    const refreshToken = this.sessao()?.refreshToken;
    this.limpar();
    if (refreshToken) {
      this.http.post(`${API}/auth/logout`, { refreshToken }).subscribe({ error: () => {} });
    }
  }

  // só apaga a sessão do navegador (usado quando a sessão já morreu no Keycloak)
  limpar(): void {
    localStorage.removeItem(CHAVE);
    this.sessao.set(null);
  }

  private guardar(resposta: TokenResponse): void {
    localStorage.setItem(CHAVE, JSON.stringify(resposta));
    this.sessao.set(resposta);
  }

  // ao abrir o site, recupera a sessão salva (se ainda dá para usar ou renovar)
  private lerDoNavegador(): TokenResponse | null {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (!salvo) return null;

      const sessao = JSON.parse(salvo) as TokenResponse;
      // sessão do login antigo (sem refresh token) ou já vencida de vez: descarta
      if (!sessao.refreshToken || (this.tokenVencido(sessao.token) && this.tokenVencido(sessao.refreshToken))) {
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
