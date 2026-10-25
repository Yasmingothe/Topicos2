import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagina } from '../models/pagina.model';
import { Pedido } from '../models/pedido.model';
import { API } from '../utils/api';

// pedidos no PAINEL (admin)
@Injectable({ providedIn: 'root' })
export class PedidoService {

  private http = inject(HttpClient);
  private readonly url = `${API}/pedidos`;

  listar(cliente = '', situacao: string | null = null, page = 0, pageSize = 10): Observable<Pagina<Pedido>> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (cliente.trim()) params = params.set('cliente', cliente.trim());
    if (situacao) params = params.set('situacao', situacao);
    return this.http.get<Pagina<Pedido>>(this.url, { params });
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }

  alterarSituacao(id: number, situacao: string): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/situacao`, { situacao });
  }
}
