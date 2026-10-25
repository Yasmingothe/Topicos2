import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Categoria } from '../../models/categoria.model';
import { AuthService } from '../../services/auth.service';
import { CategoriaService } from '../../services/categoria.service';
import { CarrinhoService } from '../../services/carrinho.service';
import { NotificacaoService } from '../../services/notificacao.service';

// moldura da loja: cabeçalho (busca, carrinho, conta) + rodapé
@Component({
  selector: 'app-loja-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule],
  templateUrl: './loja-layout.html',
  styleUrl: './loja-layout.css',
})
export class LojaLayout {

  auth = inject(AuthService);
  carrinho = inject(CarrinhoService);
  private router = inject(Router);
  private notificacao = inject(NotificacaoService);

  categorias = signal<Categoria[]>([]);

  constructor() {
    // menu de categorias do topo
    inject(CategoriaService).listar().subscribe((lista) => this.categorias.set(lista));
  }

  primeiroNome = computed(() => (this.auth.usuario()?.nome ?? '').split(' ')[0]);
  ano = new Date().getFullYear();

  buscar(evento: Event, texto: string): void {
    evento.preventDefault();
    this.router.navigate(['/'], { queryParams: texto.trim() ? { busca: texto.trim() } : {} });
  }

  sair(): void {
    this.auth.sair();
    this.notificacao.sucesso('Você saiu da sua conta.');
    this.router.navigateByUrl('/');
  }
}
