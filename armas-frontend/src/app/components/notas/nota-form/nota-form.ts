import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErroApi } from '../../../models/erro-api.model';
import { Fornecedor } from '../../../models/fornecedor.model';
import { NotaEntradaRequest } from '../../../models/nota-entrada.model';
import { Produto } from '../../../models/produto.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { NotaEntradaService } from '../../../services/nota-entrada.service';
import { NotificacaoService } from '../../../services/notificacao.service';
import { ProdutoService } from '../../../services/produto.service';
import { hojeIso, moeda } from '../../../utils/formatar';
import { dataNaoFutura } from '../../../utils/validadores';

import { VoltarDirective } from '../../../directives/voltar.directive';

@Component({
  selector: 'app-nota-form',
  imports: [VoltarDirective, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './nota-form.html',
  styleUrl: './nota-form.css',
})
export class NotaForm implements OnInit {

  private fb = inject(FormBuilder);
  private notaService = inject(NotaEntradaService);
  private fornecedorService = inject(FornecedorService);
  private produtoService = inject(ProdutoService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);

  fornecedores = signal<Fornecedor[]>([]);
  produtos = signal<Produto[]>([]);
  salvando = signal(false);
  erroGeral = signal('');

  moeda = moeda;
  hoje = hojeIso();

  form = this.fb.nonNullable.group({
    numero: ['', [Validators.required, Validators.pattern(/^\d{1,20}$/)]],
    serie: ['1', [Validators.required, Validators.maxLength(5)]],
    idFornecedor: this.fb.control<number | null>(null, Validators.required),
    dataEmissao: [hojeIso(), [Validators.required, dataNaoFutura]],
    dataEntrada: [hojeIso(), [Validators.required, dataNaoFutura]],
    observacao: ['', [Validators.maxLength(500)]],
    // FormArray = lista de linhas que cresce e diminui (os produtos da nota)
    itens: this.fb.array([this.novaLinha()]),
  });

  get itens(): FormArray {
    return this.form.controls.itens;
  }

  // valor do formulário como signal, para o total atualizar enquanto digita
  private valores = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });

  total = computed(() => (this.valores().itens ?? [])
    .reduce((soma, i) => soma + (Number(i?.quantidade) || 0) * (Number(i?.custoUnitario) || 0), 0));

  unidades = computed(() => (this.valores().itens ?? [])
    .reduce((soma, i) => soma + (Number(i?.quantidade) || 0), 0));

  ngOnInit(): void {
    this.fornecedorService.listar('', 0, 100).subscribe((p) => this.fornecedores.set(p.items.filter((f) => f.ativo)));
    this.produtoService.listar({}, 0, 500).subscribe((p) => this.produtos.set(p.items));
  }

  novaLinha() {
    return this.fb.group({
      idProduto: this.fb.control<number | null>(null, Validators.required),
      quantidade: this.fb.control<number | null>(1, [Validators.required, Validators.min(1), Validators.max(9999), Validators.pattern(/^\d+$/)]),
      custoUnitario: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
      codigoLote: this.fb.nonNullable.control('', [Validators.maxLength(30), Validators.pattern(/^[A-Za-z0-9._-]*$/)]),
    });
  }

  adicionarLinha(): void {
    this.itens.push(this.novaLinha());
  }

  removerLinha(indice: number): void {
    if (this.itens.length > 1) this.itens.removeAt(indice);
  }

  subtotal(indice: number): number {
    const linha = this.itens.at(indice).value;
    return (Number(linha.quantidade) || 0) * (Number(linha.custoUnitario) || 0);
  }

  estoqueAtual(idProduto: number | null): number | null {
    return this.produtos().find((p) => p.id === idProduto)?.estoque ?? null;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erroGeral.set('Confira os campos em vermelho.');
      return;
    }

    const valores = this.form.getRawValue();
    if (valores.dataEntrada < valores.dataEmissao) {
      this.form.controls.dataEntrada.setErrors({ antesDaEmissao: true });
      this.form.controls.dataEntrada.markAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erroGeral.set('');

    const dados = {
      ...valores,
      itens: valores.itens.map((i) => ({ ...i, codigoLote: (i.codigoLote ?? '').trim() })),
    } as NotaEntradaRequest;

    this.notaService.incluir(dados).subscribe({
      next: (nota) => {
        this.notificacao.sucesso(`NF ${nota.numero} lançada: ${nota.quantidadeTotal} unidade(s) entraram no estoque.`);
        this.router.navigate(['/admin/notas', nota.id]);
      },
      error: (erro: HttpErrorResponse) => {
        const corpo = erro.error as ErroApi | null;
        const campos = corpo?.errors ?? [];
        let aplicou = false;
        for (const e of campos) {
          const campo = this.form.get(e.field);
          if (campo) {
            campo.setErrors({ api: e.message });
            campo.markAsTouched();
            aplicou = true;
          }
        }
        if (!aplicou) this.erroGeral.set(corpo?.message ?? 'Não foi possível lançar a nota. O back-end está rodando?');
        this.salvando.set(false);
      },
    });
  }

  mensagemErro(campo: string): string {
    const erros = this.form.get(campo)?.errors;
    if (!erros) return '';
    if (erros['required']) return 'Campo obrigatório.';
    if (erros['pattern']) return campo === 'numero' ? 'Use só números.' : 'Valor inválido.';
    if (erros['maxlength']) return `Use no máximo ${erros['maxlength'].requiredLength} caracteres.`;
    if (erros['dataFutura']) return 'Não pode ser no futuro.';
    if (erros['antesDaEmissao']) return 'Não pode ser antes da emissão.';
    if (erros['api']) return erros['api'];
    return '';
  }

  erroLinha(indice: number, campo: string): string {
    const erros = this.itens.at(indice).get(campo)?.errors;
    if (!erros) return '';
    if (erros['required']) return 'Obrigatório.';
    if (erros['min']) return campo === 'quantidade' ? 'Mínimo 1.' : 'Maior que zero.';
    if (erros['max']) return 'Máximo 9999.';
    if (erros['pattern']) return campo === 'quantidade' ? 'Número inteiro.' : 'Letras, números, ponto, traço.';
    if (erros['maxlength']) return 'Até 30 caracteres.';
    return '';
  }
}
