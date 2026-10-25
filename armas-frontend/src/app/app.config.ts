import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { PaginadorPtBr } from './utils/paginador-pt-br';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // scrollPositionRestoration = ao trocar de tela, volta para o topo
    provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    // todo pedido HTTP passa pelo interceptor (que coloca o token)
    provideHttpClient(withInterceptors([authInterceptor])),
    // usa a versão em português do paginador no sistema todo
    { provide: MatPaginatorIntl, useClass: PaginadorPtBr },
  ],
};