import { Component, OnInit, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Fornecedor } from '../../../models/fornecedor.model';
import { NotaEntrada } from '../../../models/nota-entrada.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { NotaEntradaService } from '../../../services/nota-entrada.service';
import { data, moeda } from '../../../utils/formatar';

@Component({
  selector: 'app-nota-list',
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './nota-list.html',
})
export class NotaList implements OnInit {

  private notaService = inject(NotaEntradaService);
  private fornecedorService = inject(FornecedorService);
  private router = inject(Router);

  fornecedor = input<string>(); // /admin/notas?fornecedor=2

  colunas = ['nota', 'fornecedor', 'entrada', 'itens', 'valor'];

  notas = signal<NotaEntrada[]>([]);
  fornecedores = signal<Fornecedor[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  filtroNumero = signal('');
  filtroFornecedor = signal<number | null>(null);
  carregando = signal(false);
  erro = signal('');

  data = data;
  moeda = moeda;

  ngOnInit(): void {
    this.fornecedorService.listar('', 0, 100).subscribe((p) => this.fornecedores.set(p.items));
    if (this.fornecedor()) this.filtroFornecedor.set(Number(this.fornecedor()));
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.notaService.listar(this.filtroNumero(), this.filtroFornecedor(), this.pageIndex(), this.pageSize()).subscribe({
      next: (pagina) => {
        this.notas.set(pagina.items);
        this.totalItems.set(pagina.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar as notas. O back-end está rodando?');
        this.carregando.set(false);
      },
    });
  }

  buscarNumero(texto: string): void {
    this.filtroNumero.set(texto.replace(/\D/g, ''));
    this.pageIndex.set(0);
    this.carregar();
  }

  filtrarFornecedor(id: number | null): void {
    this.filtroFornecedor.set(id);
    this.pageIndex.set(0);
    this.carregar();
  }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  abrir(nota: NotaEntrada): void {
    this.router.navigate(['/admin/notas', nota.id]);
  }
}
