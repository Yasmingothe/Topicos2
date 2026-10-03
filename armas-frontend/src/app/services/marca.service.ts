import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Marca } from '../models/marca.model';
import { Pagina } from '../models/pagina.model';

@Injectable({ providedIn: 'root' })
export class MarcaService {

  private http = inject(HttpClient);
  private readonly url = 'http://localhost:8080/marcas';

  listar(nome = '', page = 0, pageSize = 10): Observable<Pagina<Marca>> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    if (nome.trim())
      params = params.set('nome', nome.trim());

    return this.http.get<Pagina<Marca>>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.url}/${id}`);
  }

  incluir(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.url, marca);
  }

  alterar(id: number, marca: Marca): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, marca);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}