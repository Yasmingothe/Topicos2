import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { cnpj, telefone } from '../../../utils/formatar';

@Component({
  selector: 'app-fornecedor-list',
  imports: [RouterLink, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './fornecedor-list.html',
})
export class FornecedorList implements OnInit {

  private fornecedorService = inject(FornecedorService);
  private notificacao = inject(NotificacaoService);

  colunas = ['razaoSocial', 'cnpj', 'contato', 'situacao', 'acoes'];

  fornecedores = signal<Fornecedor[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  busca = signal('');
  carregando = signal(false);
  erro = signal('');

  cnpj = cnpj;
  telefone = telefone;

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.fornecedorService.listar(this.busca(), this.pageIndex(), this.pageSize()).subscribe({
      next: (pagina) => {
        this.fornecedores.set(pagina.items);
        this.totalItems.set(pagina.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os fornecedores. O back-end está rodando?');
        this.carregando.set(false);
      },
    });
  }

  buscar(texto: string): void {
    this.busca.set(texto);
    this.pageIndex.set(0);
    this.carregar();
  }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  excluir(fornecedor: Fornecedor): void {
    this.notificacao.confirmar({
      titulo: 'Excluir fornecedor?',
      mensagem: `"${fornecedor.razaoSocial}" será removido. Fornecedores com notas lançadas não podem ser excluídos.`,
    }).subscribe((confirmou) => {
      if (!confirmou) return;
      this.fornecedorService.excluir(fornecedor.id).subscribe({
        next: () => {
          this.notificacao.sucesso('Fornecedor excluído.');
          if (this.fornecedores().length === 1 && this.pageIndex() > 0) this.pageIndex.update((p) => p - 1);
          this.carregar();
        },
        error: (erro) => this.notificacao.erro(erro.error?.message ?? 'Não foi possível excluir o fornecedor.'),
      });
    });
  }
}
