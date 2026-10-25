import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { OpcaoService } from '../../../services/opcao.service';
import { UsuarioService } from '../../../services/usuario.service';
import { data } from '../../../utils/formatar';
import { UsuarioDialog } from '../usuario-dialog/usuario-dialog';

@Component({
  selector: 'app-usuario-list',
  imports: [
    AsyncPipe, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatSlideToggleModule,
  ],
  templateUrl: './usuario-list.html',
})
export class UsuarioList implements OnInit {

  private usuarioService = inject(UsuarioService);
  private notificacao = inject(NotificacaoService);
  private dialog = inject(MatDialog);
  auth = inject(AuthService);
  opcoes = inject(OpcaoService);

  colunas = ['nome', 'perfil', 'cadastro', 'ativo'];

  usuarios = signal<Usuario[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  filtroNome = signal('');
  filtroPerfil = signal<string | null>(null);
  carregando = signal(false);
  erro = signal('');

  data = data;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.usuarioService.listar(this.filtroNome(), this.filtroPerfil(), this.pageIndex(), this.pageSize()).subscribe({
      next: (pagina) => {
        this.usuarios.set(pagina.items);
        this.totalItems.set(pagina.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os usuários. O back-end está rodando?');
        this.carregando.set(false);
      },
    });
  }

  buscar(texto: string): void {
    this.filtroNome.set(texto);
    this.pageIndex.set(0);
    this.carregar();
  }

  filtrarPerfil(perfil: string | null): void {
    this.filtroPerfil.set(perfil);
    this.pageIndex.set(0);
    this.carregar();
  }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  novo(): void {
    this.dialog.open(UsuarioDialog, { width: '440px', panelClass: 'janela-produto' })
      .afterClosed()
      .subscribe((criou) => { if (criou) this.carregar(); });
  }

  alternar(usuario: Usuario): void {
    const requisicao = usuario.ativo
      ? this.usuarioService.desativar(usuario.id)
      : this.usuarioService.ativar(usuario.id);

    requisicao.subscribe({
      next: () => {
        this.notificacao.sucesso(usuario.ativo ? `${usuario.nome} foi desativado.` : `${usuario.nome} foi ativado.`);
        this.carregar();
      },
      error: (erro) => {
        this.notificacao.erro(erro.error?.message ?? 'Não foi possível alterar o usuário.');
        this.carregar(); // volta o botão para a posição certa
      },
    });
  }
}
