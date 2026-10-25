import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// guard = "porteiro" da rota: decide se a pessoa pode abrir a tela

// painel: só ADMIN
export const adminGuard: CanActivateFn = (_rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.ehAdmin()) return true;
  if (auth.logado()) return router.createUrlTree(['/']); // cliente logado tentando entrar no painel
  return router.createUrlTree(['/login'], { queryParams: { voltar: estado.url } });
};

// checkout, minha conta, meus pedidos: só CLIENTE logado
export const clienteGuard: CanActivateFn = (_rota, estado) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.ehCliente()) return true;
  if (auth.ehAdmin()) return router.createUrlTree(['/admin/dashboard']);
  return router.createUrlTree(['/login'], { queryParams: { voltar: estado.url } });
};

// login e cadastro: quem já está logado não precisa ver
export const visitanteGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.logado()) return true;
  return router.createUrlTree([auth.ehAdmin() ? '/admin/dashboard' : '/']);
};

// carrinho: aberto para visitante e cliente; o admin não compra na própria loja
export const naoAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.ehAdmin() ? router.createUrlTree(['/admin/dashboard']) : true;
};
