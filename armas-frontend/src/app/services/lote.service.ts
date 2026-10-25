import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Lote, RastreioLote } from '../models/lote.model';
import { Pagina } from '../models/pagina.model';
import { API } from '../utils/api';

export interface FiltroLote {
  codigo?: string;
  idProduto?: number | null;
  comSaldo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class LoteService {

  private http = inject(HttpClient);
  private readonly url = `${API}/lotes`;

  listar(filtro: FiltroLote, page = 0, pageSize = 10): Observable<Pagina<Lote>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (filtro.codigo?.trim()) params = params.set('codigo', filtro.codigo.trim());
    if (filtro.idProduto) params = params.set('idProduto', filtro.idProduto);
    if (filtro.comSaldo) params = params.set('comSaldo', true);
    return this.http.get<Pagina<Lote>>(this.url, { params });
  }

  rastrear(id: number): Observable<RastreioLote> {
    return this.http.get<RastreioLote>(`${this.url}/${id}/rastreio`);
  }
}
