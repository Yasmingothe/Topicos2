import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagina } from '../models/pagina.model';
import { Produto, ProdutoRequest } from '../models/produto.model';

export interface FiltroProduto {
  nome?: string;
  idMarca?: number | null;
  categoria?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private http = inject(HttpClient);
  private readonly url = 'http://localhost:8080/produtos';

  listar(filtro: FiltroProduto, page = 0, pageSize = 10): Observable<Pagina<Produto>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (filtro.nome?.trim())
      params = params.set('nome', filtro.nome.trim());
    if (filtro.idMarca)
      params = params.set('idMarca', filtro.idMarca);
    if (filtro.categoria)
      params = params.set('categoria', filtro.categoria);

    return this.http.get<Pagina<Produto>>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.url}/${id}`);
  }

  incluir(produto: ProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.url, produto);
  }

  alterar(id: number, produto: ProdutoRequest): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}