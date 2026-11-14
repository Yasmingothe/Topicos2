import { Component, OnInit, inject, input, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { OpcaoService } from '../../../services/opcao.service';
import { corSituacao, data } from '../../../utils/formatar';
import { exportarCsv } from '../../../utils/exportar-csv';
import { FiltroMenu } from '../../shared/filtro-menu';

@Component({
  selector: 'app-cliente-list',
  imports: [FiltroMenu, 
    AsyncPipe, RouterLink, MatTableModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatTooltipModule,
  ],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css',
})
export class ClienteList implements OnInit {

  private clienteService = inject(ClienteService);
  private notificacao = inject(NotificacaoService);
  opcoes = inject(OpcaoService);

  autorizacao = input<string>(); // /admin/clientes?autorizacao=EM_ANALISE (vem do dashboard)

  colunas = ['nome', 'cpf', 'cidade', 'autorizacao', 'acoes'];
  filtroAutorizacao = signal<string | null>(null);

  corSituacao = corSituacao;
  data = data;

  clientes = signal<Cliente[]>([]);
  totalItems = signal(0);
  pageIndex = signal(0);
  pageSize = signal(10);
  filtro = signal('');
  carregando = signal(false);
  erro = signal('');

  ngOnInit(): void {
    if (this.autorizacao()) this.filtroAutorizacao.set(this.autorizacao()!);
    this.carregar();
  }

  carregar(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.clienteService.listar(this.filtro(), this.pageIndex(), this.pageSize(), this.filtroAutorizacao()).subscribe({
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

  filtrarAutorizacao(situacao: string | null): void {
    this.filtroAutorizacao.set(situacao);
    this.pageIndex.set(0);
    this.carregar();
  }

  // ===== LIMPAR =====
  limparFiltro(): void {
    this.filtroAutorizacao.set(null);
    this.buscar('');
  }

  // ===== AUTORIZAÇÃO DE COMPRA =====
  avaliar(cliente: Cliente, situacao: 'APROVADA' | 'RECUSADA'): void {
    const aprovar = situacao === 'APROVADA';
    this.notificacao.confirmar({
      titulo: aprovar ? 'Aprovar autorização?' : 'Recusar autorização?',
      mensagem: aprovar
        ? `${cliente.nome} poderá comprar armas e munições até ${data(cliente.validadeAutorizacao)} (nº ${cliente.numeroAutorizacao}).`
        : `${cliente.nome} continua podendo comprar acessórios, mas não armas e munições.`,
      textoBotao: aprovar ? 'APROVAR' : 'RECUSAR',
      icone: aprovar ? 'task_alt' : 'do_not_disturb_on',
    }).subscribe((confirmou) => {
      if (!confirmou) return;
      this.clienteService.avaliarAutorizacao(cliente.id, situacao).subscribe({
        next: () => {
          this.notificacao.sucesso(aprovar ? 'Autorização aprovada.' : 'Autorização recusada.');
          this.carregar();
        },
        error: (erro) => this.notificacao.erro(erro.error?.message ?? 'Não foi possível avaliar a autorização.'),
      });
    });
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