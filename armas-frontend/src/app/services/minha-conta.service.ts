import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AutorizacaoRequest, Cliente, ClienteRequest } from '../models/cliente.model';
import { Pagina } from '../models/pagina.model';
import { Pedido, PedidoRequest } from '../models/pedido.model';
import { API } from '../utils/api';

// tudo do cliente logado (o back descobre quem é pelo token)
@Injectable({ providedIn: 'root' })
export class MinhaContaService {

  private http = inject(HttpClient);
  private readonly url = `${API}/minha-conta`;

  // null = ainda não preencheu os dados (o back responde 204)
  meusDados(): Observable<Cliente | null> {
    return this.http.get<Cliente | null>(`${this.url}/cliente`);
  }

  salvarDados(dados: ClienteRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/cliente`, dados);
  }

  enviarAutorizacao(dados: AutorizacaoRequest): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/autorizacao`, dados);
  }

  finalizarCompra(pedido: PedidoRequest): Observable<Pedido> {
    return this.http.post<Pedido>(`${this.url}/pedidos`, pedido);
  }

  meusPedidos(page = 0, pageSize = 10): Observable<Pagina<Pedido>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<Pagina<Pedido>>(`${this.url}/pedidos`, { params });
  }

  cancelarPedido(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/pedidos/${id}/cancelar`, {});
  }
}
