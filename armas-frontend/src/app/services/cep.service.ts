import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EnderecoViaCep } from '../models/endereco-viacep.model';

@Injectable({ providedIn: 'root' })
export class CepService {

  private http = inject(HttpClient);

  consultar(cep: string): Observable<EnderecoViaCep | null> {
    return this.http
      .get<EnderecoViaCep>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(map((resposta) => (resposta.erro ? null : resposta)));
  }
}