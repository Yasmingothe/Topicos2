import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { NotificacaoService } from '../../services/notificacao.service';

// moldura do painel: menu lateral + barra do topo + a tela aberta no meio
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatMenuModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

  auth = inject(AuthService);
  private router = inject(Router);
  private notificacao = inject(NotificacaoService);

  // itens do menu: rota = endereço, icone = nome do ícone do Material
  grupos = [
    {
      titulo: 'VISÃO GERAL',
      itens: [{ rota: '/admin/dashboard', rotulo: 'Dashboard', icone: 'bar_chart' }],
    },
    {
      titulo: 'VENDAS',
      itens: [{ rota: '/admin/pedidos', rotulo: 'Pedidos', icone: 'receipt_long' }],
    },
    {
      titulo: 'ESTOQUE',
      itens: [
        { rota: '/admin/notas', rotulo: 'Notas de entrada', icone: 'inventory' },
        { rota: '/admin/lotes', rotulo: 'Rastreio de lotes', icone: 'qr_code_2' },
        { rota: '/admin/fornecedores', rotulo: 'Fornecedores', icone: 'local_shipping' },
      ],
    },
    {
      titulo: 'CATÁLOGO',
      itens: [
        { rota: '/admin/produtos', rotulo: 'Produtos', icone: 'inventory_2' },
        { rota: '/admin/marcas', rotulo: 'Marcas', icone: 'shield' },
      ],
    },
    {
      titulo: 'PESSOAS',
      itens: [
        { rota: '/admin/clientes', rotulo: 'Clientes', icone: 'person' },
        { rota: '/admin/usuarios', rotulo: 'Usuários', icone: 'admin_panel_settings' },
      ],
    },
  ];

  iniciais = computed(() => {
    const partes = (this.auth.usuario()?.nome ?? '?').trim().split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
  });

  sair(): void {
    this.auth.sair();
    this.notificacao.sucesso('Você saiu do painel.');
    this.router.navigateByUrl('/login');
  }
}
