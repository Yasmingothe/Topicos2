import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificacaoService } from '../services/notificacao.service';
import { API } from '../utils/api';

// rotas de login/cadastro/renovação/logout/recuperação de senha não levam token e não tentam renovar
const ROTAS_DE_LOGIN = /\/auth\/(login|cadastro|renovar|logout|esqueci-senha|redefinir-senha)$/;

// interceptor = passa por TODA requisição antes de sair.
// 1) coloca o token no cabeçalho Authorization (só nas chamadas ao nosso back, nunca no ViaCEP)
// 2) 401 (token vencido): pede um token novo ao back e repete a requisição;
//    se não der para renovar, desloga e manda para o login
// 3) 403 (sem permissão para o papel): mostra o aviso
export const authInterceptor: HttpInterceptorFn = (requisicao, proximo) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notificacao = inject(NotificacaoService);

  const ehNossaApi = requisicao.url.startsWith(API);
  const ehRotaDeLogin = ROTAS_DE_LOGIN.test(requisicao.url);

  const comToken = (req: HttpRequest<unknown>, token: string | null) =>
    token && ehNossaApi && !ehRotaDeLogin
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return proximo(comToken(requisicao, auth.token())).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (!ehNossaApi || ehRotaDeLogin) return throwError(() => erro);

      // 401 = não autenticado: tenta renovar a sessão uma vez
      if (erro.status === 401 && auth.logado()) {
        return auth.renovar().pipe(
          catchError(() => {
            auth.limpar();
            router.navigate(['/login'], { queryParams: { expirou: 1 } });
            return throwError(() => erro);
          }),
          switchMap((nova) => proximo(comToken(requisicao, nova.token))),
        );
      }

      // 403 = logado, mas o papel não permite (ex.: CLIENTE chamando rota de ADMIN)
      if (erro.status === 403) {
        notificacao.erro('Você não tem permissão para acessar este recurso.');
      }

      return throwError(() => erro);
    }),
  );
};
