import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { exportarCsv } from '../../../utils/exportar-csv';

@Component({
  selector: 'app-cliente-list',
  imports: [
    RouterLink, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
  ],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {

  private clienteService = inject(ClienteService);
  private notificacao = inject(NotificacaoService);

  colunas = ['nome', 'cpf', 'telefone', 'cidade', 'acoes'];

  clientes = signal<Cliente[]>([]);
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

    this.clienteService.listar(this.filtro(), this.pageIndex(), this.pageSize()).subscribe({
      next: (pagina) => {
        this.clientes.set(pagina.items);
        this.totalItems.set(pagina.totalItems);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os clientes. O back-end está rodando?');
        this.carregando.set(false);
      },
    });
  }

  buscar(texto: string): void {
    this.filtro.set(texto);
    this.pageIndex.set(0);
    this.carregar();
  }

  // ===== LIMPAR =====
  limparFiltro(): void {
    this.buscar('');
  }

  mudarPagina(evento: PageEvent): void {
    this.pageIndex.set(evento.pageIndex);
    this.pageSize.set(evento.pageSize);
    this.carregar();
  }

  formatarCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  formatarTelefone(telefone: string): string {
    return telefone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  }

  // ===== EXPORTAR =====
  exportar(): void {
    this.clienteService.listar(this.filtro(), 0, Math.max(this.totalItems(), 1)).subscribe({
      next: (pagina) => {
        exportarCsv(
          'clientes',
          ['Código', 'Nome', 'E-mail', 'CPF', 'Telefone', 'Nascimento', 'CEP', 'Endereço', 'Cidade', 'UF'],
          pagina.items.map((c) => [
            c.id,
            c.nome,
            c.email,
            this.formatarCpf(c.cpf),
            this.formatarTelefone(c.telefone),
            c.dataNascimento.split('-').reverse().join('/'),
            c.cep,
            `${c.logradouro}, ${c.numero} - ${c.bairro}`,
            c.municipio.nome,
            c.municipio.estado.sigla,
          ]),
        );
        this.notificacao.sucesso(`${pagina.items.length} cliente(s) exportado(s).`);
      },
      error: () => this.notificacao.erro('Não foi possível exportar os clientes.'),
    });
  }

  // ===== EXCLUIR (com a janela de confirmação) =====
  excluir(cliente: Cliente): void {
    this.notificacao.confirmar({
      titulo: 'Excluir cliente?',
      mensagem: `O cadastro de "${cliente.nome}" e o endereço dele serão removidos.`,
    }).subscribe((confirmou) => {
      if (!confirmou)
        return;

      this.clienteService.excluir(cliente.id).subscribe({
        next: () => {
          this.notificacao.sucesso('Cliente excluído com sucesso.');
          if (this.clientes().length === 1 && this.pageIndex() > 0)
            this.pageIndex.update((pagina) => pagina - 1);
          this.carregar();
        },
        error: (erro) => this.notificacao.erro(erro.error?.message ?? 'Não foi possível excluir o cliente.'),
      });
    });
  }
}