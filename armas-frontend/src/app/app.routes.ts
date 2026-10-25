import { Routes } from '@angular/router';
import { adminGuard, clienteGuard, naoAdminGuard, visitanteGuard } from './guards/auth.guard';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { LojaLayout } from './layouts/loja-layout/loja-layout';

import { Login } from './components/auth/login/login';
import { Cadastro } from './components/auth/cadastro/cadastro';

import { Dashboard } from './components/dashboard/dashboard';
import { MarcaList } from './components/marcas/marca-list/marca-list';
import { MarcaForm } from './components/marcas/marca-form/marca-form';
import { ProdutoList } from './components/produtos/produto-list/produto-list';
import { ProdutoForm } from './components/produtos/produto-form/produto-form';
import { ClienteList } from './components/clientes/cliente-list/cliente-list';
import { ClienteForm } from './components/clientes/cliente-form/cliente-form';
import { UsuarioList } from './components/usuarios/usuario-list/usuario-list';
import { FornecedorList } from './components/fornecedores/fornecedor-list/fornecedor-list';
import { FornecedorForm } from './components/fornecedores/fornecedor-form/fornecedor-form';
import { NotaList } from './components/notas/nota-list/nota-list';
import { NotaForm } from './components/notas/nota-form/nota-form';
import { NotaDetalhe } from './components/notas/nota-detalhe/nota-detalhe';
import { LoteRastreio } from './components/lotes/lote-rastreio/lote-rastreio';
import { PedidoList } from './components/pedidos/pedido-list/pedido-list';
import { PedidoDetalhe } from './components/pedidos/pedido-detalhe/pedido-detalhe';

import { Catalogo } from './components/loja/catalogo/catalogo';
import { ProdutoPagina } from './components/loja/produto-pagina/produto-pagina';
import { Carrinho } from './components/loja/carrinho/carrinho';
import { Checkout } from './components/loja/checkout/checkout';
import { MinhaConta } from './components/loja/minha-conta/minha-conta';
import { MeusPedidos } from './components/loja/meus-pedidos/meus-pedidos';

export const routes: Routes = [
  // ===== entrar / criar conta (sem menu) =====
  { path: 'login', component: Login, canActivate: [visitanteGuard], title: 'Entrar | ZERO1' },
  { path: 'cadastro', component: Cadastro, canActivate: [visitanteGuard], title: 'Criar conta | ZERO1' },

  // ===== painel: só ADMIN (o guard confere antes de abrir) =====
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard, title: 'Dashboard | ZERO1' },

      { path: 'pedidos', component: PedidoList, title: 'Pedidos | ZERO1' },
      { path: 'pedidos/:id', component: PedidoDetalhe, title: 'Pedido | ZERO1' },

      { path: 'notas', component: NotaList, title: 'Notas de entrada | ZERO1' },
      { path: 'notas/nova', component: NotaForm, title: 'Lançar nota | ZERO1' },
      { path: 'notas/:id', component: NotaDetalhe, title: 'Nota fiscal | ZERO1' },
      { path: 'lotes', component: LoteRastreio, title: 'Rastreio de lotes | ZERO1' },

      { path: 'fornecedores', component: FornecedorList, title: 'Fornecedores | ZERO1' },
      { path: 'fornecedores/novo', component: FornecedorForm, title: 'Novo fornecedor | ZERO1' },
      { path: 'fornecedores/editar/:id', component: FornecedorForm, title: 'Editar fornecedor | ZERO1' },

      { path: 'marcas', component: MarcaList, title: 'Marcas | ZERO1' },
      { path: 'marcas/nova', component: MarcaForm, title: 'Nova marca | ZERO1' },
      { path: 'marcas/editar/:id', component: MarcaForm, title: 'Editar marca | ZERO1' },

      { path: 'produtos', component: ProdutoList, title: 'Produtos | ZERO1' },
      { path: 'produtos/novo', component: ProdutoForm, title: 'Novo produto | ZERO1' },
      { path: 'produtos/editar/:id', component: ProdutoForm, title: 'Editar produto | ZERO1' },
      { path: 'produtos/duplicar/:idOrigem', component: ProdutoForm, title: 'Duplicar produto | ZERO1' },

      { path: 'clientes', component: ClienteList, title: 'Clientes | ZERO1' },
      { path: 'clientes/novo', component: ClienteForm, title: 'Novo cliente | ZERO1' },
      { path: 'clientes/editar/:id', component: ClienteForm, title: 'Editar cliente | ZERO1' },

      { path: 'usuarios', component: UsuarioList, title: 'Usuários | ZERO1' },
    ],
  },

  // ===== loja: aberta para todos; algumas telas pedem login de CLIENTE =====
  {
    path: '',
    component: LojaLayout,
    children: [
      { path: '', component: Catalogo, title: 'ZERO1 | Armas e equipamentos' },
      { path: 'produto/:id', component: ProdutoPagina, title: 'Produto | ZERO1' },
      { path: 'carrinho', component: Carrinho, canActivate: [naoAdminGuard], title: 'Carrinho | ZERO1' },
      { path: 'checkout', component: Checkout, canActivate: [clienteGuard], title: 'Finalizar compra | ZERO1' },
      { path: 'minha-conta', component: MinhaConta, canActivate: [clienteGuard], title: 'Minha conta | ZERO1' },
      { path: 'meus-pedidos', component: MeusPedidos, canActivate: [clienteGuard], title: 'Meus pedidos | ZERO1' },
    ],
  },

  { path: '**', redirectTo: '' },
];
