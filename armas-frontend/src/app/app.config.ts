import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { PaginadorPtBr } from './utils/paginador-pt-br';
import { authInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // scrollPositionRestoration = ao trocar de tela, volta para o topo
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withViewTransitions({ skipInitialTransition: true }),
    ),
    // todo pedido HTTP passa pelo interceptor (renova e coloca o Bearer token)
    provideHttpClient(withInterceptors([authInterceptor])),
    // inicializa a sessao OIDC / Keycloak antes de renderizar as rotas
    provideAppInitializer(() => inject(AuthService).init()),
    // usa a versao em portugues do paginador no sistema todo
    { provide: MatPaginatorIntl, useClass: PaginadorPtBr },
  ],
};
