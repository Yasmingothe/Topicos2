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

  excluir(marca: Marca): void {
    if (!confirm(`Deseja excluir a marca "${marca.nome}"?`))
      return;

    this.marcaService.excluir(marca.id!).subscribe({
      next: () => {
        if (this.marcas().length === 1 && this.pageIndex() > 0)
          this.pageIndex.update((pagina) => pagina - 1);
        this.carregar();
      },
      error: (erro) => alert(erro.error?.message ?? 'Não foi possível excluir a marca.'),
    });
  }
}