import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, ClienteRequest, Estado } from '../models/cliente.model';
import { Pagina } from '../models/pagina.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private http = inject(HttpClient);
  private readonly url = 'http://localhost:8080/clientes';

  listar(nome = '', page = 0, pageSize = 10, autorizacao: string | null = null): Observable<Pagina<Cliente>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (nome.trim())
      params = params.set('nome', nome.trim());
    if (autorizacao)
      params = params.set('autorizacao', autorizacao);

    return this.http.get<Pagina<Cliente>>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  incluir(cliente: ClienteRequest): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, cliente);
  }

  alterar(id: number, cliente: ClienteRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, cliente);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  listarEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>('http://localhost:8080/estados');
  }

  // APROVADA ou RECUSADA
  avaliarAutorizacao(id: number, situacao: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/autorizacao`, { situacao });
  }
}
