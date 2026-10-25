import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagina } from '../models/pagina.model';
import { Usuario, UsuarioRequest } from '../models/usuario.model';
import { API } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private http = inject(HttpClient);
  private readonly url = `${API}/usuarios`;

  listar(nome = '', perfil: string | null = null, page = 0, pageSize = 10): Observable<Pagina<Usuario>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (nome.trim()) params = params.set('nome', nome.trim());
    if (perfil) params = params.set('perfil', perfil);
    return this.http.get<Pagina<Usuario>>(this.url, { params });
  }

  incluir(usuario: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario);
  }

  ativar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/ativar`, {});
  }

  desativar(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/desativar`, {});
  }
}
