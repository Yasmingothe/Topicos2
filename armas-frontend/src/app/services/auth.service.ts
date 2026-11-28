import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { API, KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM, KEYCLOAK_URL } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private keycloakInstance = new Keycloak({
    url: KEYCLOAK_URL,
    realm: KEYCLOAK_REALM,
    clientId: KEYCLOAK_CLIENT_ID,
  });

  private _usuario = signal<Usuario | null>(null);
  private _autenticado = signal<boolean>(false);

  // signals compativeis com os componentes e layouts
  usuario = computed(() => this._usuario());
  logado = computed(() => this._autenticado());
  ehAdmin = computed(() => {
    const roles = this.keycloakInstance.realmAccess?.roles ?? [];
    return roles.includes('ADMIN') || this._usuario()?.perfil?.codigo === 'ADMIN';
  });
  ehCliente = computed(() => {
    const roles = this.keycloakInstance.realmAccess?.roles ?? [];
    return roles.includes('CLIENTE') || this._usuario()?.perfil?.codigo === 'CLIENTE';
  });

  async init(): Promise<boolean> {
    try {
      const autenticado = await this.keycloakInstance.init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      });

      this._autenticado.set(Boolean(autenticado));

      if (autenticado) {
        this.preencherUsuarioDoToken();
        await this.carregarUsuarioBackend();
      }

      return Boolean(autenticado);
    } catch (err) {
      console.warn('Erro ao inicializar o Keycloak:', err);
      this._autenticado.set(false);
      return false;
    }
  }

  token(): string | null {
    return this.keycloakInstance.token ?? null;
  }

  async getTokenValido(): Promise<string | null> {
    if (!this.keycloakInstance.authenticated) return null;
    try {
      // Renova o token se faltar menos de 30 segundos para expirar
      await this.keycloakInstance.updateToken(30);
    } catch {
      console.warn('Sessao expirada ou falha ao atualizar token');
      this.sair();
      return null;
    }
    return this.keycloakInstance.token ?? null;
  }

  login(redirectUri?: string): Promise<void> {
    return this.keycloakInstance.login({
      redirectUri: redirectUri || window.location.origin,
    });
  }

  cadastrar(redirectUri?: string): Promise<void> {
    return this.keycloakInstance.register({
      redirectUri: redirectUri || window.location.origin,
    });
  }

  sair(): void {
    this._autenticado.set(false);
    this._usuario.set(null);
    this.keycloakInstance.logout({
      redirectUri: window.location.origin,
    });
  }

  atualizarNome(nome: string): void {
    const atual = this._usuario();
    if (!atual) return;
    this._usuario.set({ ...atual, nome });
  }

  private preencherUsuarioDoToken(): void {
    const tokenParsed = this.keycloakInstance.tokenParsed;
    if (!tokenParsed) return;

    const roles = this.keycloakInstance.realmAccess?.roles ?? [];
    const isAdmin = roles.includes('ADMIN');
    const nome =
      (tokenParsed['name'] as string) ||
      (tokenParsed['preferred_username'] as string) ||
      'Usuário';
    const email = (tokenParsed['email'] as string) || '';

    this._usuario.set({
      id: 0,
      nome,
      email,
      perfil: isAdmin
        ? { codigo: 'ADMIN', nome: 'Administrador' }
        : { codigo: 'CLIENTE', nome: 'Cliente' },
      ativo: true,
      dataCadastro: new Date().toISOString(),
    });
  }

  async carregarUsuarioBackend(): Promise<void> {
    try {
      const dados = await firstValueFrom(this.http.get<Usuario>(`${API}/auth/eu`));
      if (dados) {
        this._usuario.set(dados);
      }
    } catch (err) {
      console.warn('Nao foi possivel carregar /auth/eu:', err);
    }
  }
}
