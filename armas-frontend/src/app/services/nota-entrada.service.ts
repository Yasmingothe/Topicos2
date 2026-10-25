import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NotaEntrada, NotaEntradaRequest } from '../models/nota-entrada.model';
import { Pagina } from '../models/pagina.model';
import { API } from '../utils/api';

@Injectable({ providedIn: 'root' })
export class NotaEntradaService {

  private http = inject(HttpClient);
  private readonly url = `${API}/notas-entrada`;

  listar(numero = '', idFornecedor: number | null = null, page = 0, pageSize = 10): Observable<Pagina<NotaEntrada>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (numero.trim()) params = params.set('numero', numero.trim());
    if (idFornecedor) params = params.set('idFornecedor', idFornecedor);
    return this.http.get<Pagina<NotaEntrada>>(this.url, { params });
  }

  buscarPorId(id: number): Observable<NotaEntrada> {
    return this.http.get<NotaEntrada>(`${this.url}/${id}`);
  }

  incluir(nota: NotaEntradaRequest): Observable<NotaEntrada> {
    return this.http.post<NotaEntrada>(this.url, nota);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
