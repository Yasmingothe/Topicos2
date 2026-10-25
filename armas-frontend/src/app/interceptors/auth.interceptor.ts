import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API } from '../utils/api';

// interceptor = passa por TODA requisição antes de sair.
// 1) coloca o token no cabeçalho Authorization (só nas chamadas ao nosso back, nunca no ViaCEP)
// 2) se o back responder 401 (token vencido/inválido), desloga e manda para o login
export const authInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.token();

  const comToken = token && requisicao.url.startsWith(API)
    ? requisicao.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : requisicao;

  return proximo(comToken).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401 && token && !requisicao.url.endsWith('/auth/login')) {
        auth.sair();
        router.navigate(['/login'], { queryParams: { expirou: 1 } });
      }
      return throwError(() => erro);
    }),
  );
};
