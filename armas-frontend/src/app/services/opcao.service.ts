import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Opcao } from '../models/opcao.model';
import { API } from '../utils/api';

// listas fixas para os selects; shareReplay = busca uma vez só e reaproveita
@Injectable({ providedIn: 'root' })
export class OpcaoService {

  private http = inject(HttpClient);

  situacoesPedido$ = this.http.get<Opcao[]>(`${API}/opcoes/situacoes-pedido`).pipe(shareReplay(1));
  situacoesAutorizacao$ = this.http.get<Opcao[]>(`${API}/opcoes/situacoes-autorizacao`).pipe(shareReplay(1));
  perfis$: Observable<Opcao[]> = this.http.get<Opcao[]>(`${API}/opcoes/perfis`).pipe(shareReplay(1));
}
