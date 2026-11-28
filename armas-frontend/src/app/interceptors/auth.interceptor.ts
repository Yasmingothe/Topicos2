import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API } from '../utils/api';

// interceptor = passa por TODA requisicao antes de sair.
// 1) Renova o token OIDC se estiver perto de vencer
// 2) Coloca o token no cabecalho Authorization (apenas nas chamadas para nossa API)
// 3) Em caso de 401, finaliza a sessao
export const authInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const auth = inject(AuthService);

  if (!requisicao.url.startsWith(API)) {
    return proximo(requisicao);
  }

  return from(auth.getTokenValido()).pipe(
    switchMap((token) => {
      const comToken = token
        ? requisicao.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : requisicao;

      return proximo(comToken).pipe(
        catchError((erro: HttpErrorResponse) => {
          if (erro.status === 401 && token) {
            auth.sair();
          }
          return throwError(() => erro);
        }),
      );
    }),
  );
};
