import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Marca } from '../../../models/marca.model';
import { MarcaService } from '../../../services/marca.service';
import { NotificacaoService } from '../../../services/notificacao.service';

@Component({
  selector: 'app-marca-list',
  imports: [
    RouterLink, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
  ],
  templateUrl: './marca-list.html',
  styleUrl: './marca-list.css',
})
export class MarcaList implements OnInit {

  private marcaService = inject(MarcaService);
  private notificacao = inject(NotificacaoService);

  colunas = ['nome', 'paisOrigem', 'ativa', 'acoes'];

  marcas = signal<Marca[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  filtro = signal('');
  carregando = signal(false);
  erro = signal('');

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.marcaService.listar(this.filtro(), this.pageIndex(), this.pageSize())
      .subscribe({
        next: (pagina) => {
          this.marcas.set(pagina.items);
          this.totalItems.set(pagina.totalItems);
          this.carregando.set(false);
        },
        error: () => {
          this.erro.set('Não foi possível carregar as marcas. O back-end está rodando?');
          this.carregando.set(false);
        },
      });
  }

  buscar(texto: string): void {
    this.filtro.set(texto);
    this.pageIndex.set(0);
    this.carregar();
  }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  // ===== EXCLUIR (com a janela de confirmação nova) =====
  excluir(marca: Marca): void {
    this.notificacao.confirmar({
      titulo: 'Excluir marca?',
      mensagem: `A marca "${marca.nome}" será removida. Marcas com produtos cadastrados não podem ser excluídas.`,
    }).subscribe((confirmou) => {
      if (!confirmou)
        return;

      this.marcaService.excluir(marca.id!).subscribe({
        next: () => {
          this.notificacao.sucesso('Marca excluída com sucesso.');
          if (this.marcas().length === 1 && this.pageIndex() > 0)
            this.pageIndex.update((pagina) => pagina - 1);
          this.carregar();
        },
        error: (erro) => this.notificacao.erro(erro.error?.message ?? 'Não foi possível excluir a marca.'),
      });
    });
  }
}