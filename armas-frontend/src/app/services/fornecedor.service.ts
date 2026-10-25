import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor, FornecedorRequest } from '../models/fornecedor.model';
import { Pagina } from '../models/pagina.model';
import { API } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class FornecedorService {

  private http = inject(HttpClient);
  private readonly url = `${API}/fornecedores`;

  listar(busca = '', page = 0, pageSize = 10): Observable<Pagina<Fornecedor>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (busca.trim()) params = params.set('busca', busca.trim());
    return this.http.get<Pagina<Fornecedor>>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.url}/${id}`);
  }

  incluir(fornecedor: FornecedorRequest): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.url, fornecedor);
  }

  alterar(id: number, fornecedor: FornecedorRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, fornecedor);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
