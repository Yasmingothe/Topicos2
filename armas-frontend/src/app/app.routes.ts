import { Routes } from '@angular/router';
import { MarcaList } from './components/marcas/marca-list/marca-list';
import { MarcaForm } from './components/marcas/marca-form/marca-form';
import { ProdutoList } from './components/produtos/produto-list/produto-list';
import { ProdutoForm } from './components/produtos/produto-form/produto-form';
import { ClienteList } from './components/clientes/cliente-list/cliente-list';
import { ClienteForm } from './components/clientes/cliente-form/cliente-form';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: Dashboard, title: 'Dashboard' },

  { path: 'admin/marcas', component: MarcaList, title: 'Marcas' },
  { path: 'admin/marcas/nova', component: MarcaForm, title: 'Nova marca' },
  { path: 'admin/marcas/editar/:id', component: MarcaForm, title: 'Editar marca' },

  { path: 'admin/produtos', component: ProdutoList, title: 'Produtos' },
  { path: 'admin/produtos/novo', component: ProdutoForm, title: 'Novo produto' },
  { path: 'admin/produtos/editar/:id', component: ProdutoForm, title: 'Editar produto' },
  { path: 'admin/produtos/duplicar/:idOrigem', component: ProdutoForm, title: 'Duplicar produto' },

  { path: 'admin/clientes', component: ClienteList, title: 'Clientes' },
  { path: 'admin/clientes/novo', component: ClienteForm, title: 'Novo cliente' },
  { path: 'admin/clientes/editar/:id', component: ClienteForm, title: 'Editar cliente' },
];