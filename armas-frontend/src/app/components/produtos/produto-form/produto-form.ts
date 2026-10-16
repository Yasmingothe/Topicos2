import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Categoria } from '../../../models/categoria.model';
import { ErroApi } from '../../../models/erro-api.model';
import { Marca } from '../../../models/marca.model';
import { ProdutoRequest } from '../../../models/produto.model';
import { CategoriaService } from '../../../services/categoria.service';
import { MarcaService } from '../../../services/marca.service';
import { ProdutoService } from '../../../services/produto.service';
import { NotificacaoService } from '../../../services/notificacao.service';

function naoSomenteEspacos(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  return valor && valor.trim().length === 0 ? { somenteEspacos: true } : null;
}

@Component({
  selector: 'app-produto-form',
  imports: [
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
  ],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm implements OnInit {

  private fb = inject(FormBuilder);
  private produtoService = inject(ProdutoService);
  private marcaService = inject(MarcaService);
  private categoriaService = inject(CategoriaService);
  private notificacao = inject(NotificacaoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = signal<number | null>(null);
  carregando = signal(false);
  salvando = signal(false);
  erroGeral = signal('');

  marcas = signal<Marca[]>([]);
  categorias = signal<Categoria[]>([]);

  form = this.fb.group({
    nome: this.fb.nonNullable.control('', [
      Validators.required, Validators.minLength(2), Validators.maxLength(120), naoSomenteEspacos,
    ]),
    idMarca: this.fb.control<number | null>(null, Validators.required),
    categoria: this.fb.nonNullable.control('', Validators.required),
    calibre: this.fb.nonNullable.control('', Validators.maxLength(30)),
    preco: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    estoque: this.fb.control<number | null>(null, [
      Validators.required, Validators.min(0), Validators.pattern(/^\d+$/),
    ]),
    descricao: this.fb.nonNullable.control('', Validators.maxLength(1000)),
    publicado: this.fb.nonNullable.control(true),
  });

  ngOnInit(): void {
    this.marcaService.listar('', 0, 100).subscribe((pagina) => this.marcas.set(pagina.items));
    this.categoriaService.listar().subscribe((lista) => this.categorias.set(lista));

    const idDaUrl = this.route.snapshot.paramMap.get('id');
    if (!idDaUrl)
      return;

    this.id.set(Number(idDaUrl));
    this.carregando.set(true);

    this.produtoService.buscarPorId(this.id()!).subscribe({
      next: (produto) => {
        this.form.patchValue({
          nome: produto.nome,
          idMarca: produto.marca.id ?? null,
          categoria: produto.categoria.codigo,
          calibre: produto.calibre ?? '',
          preco: produto.preco,
          estoque: produto.estoque,
          descricao: produto.descricao ?? '',
          publicado: produto.publicado,
        });
        this.carregando.set(false);
      },
      error: () => {
        this.erroGeral.set('Produto não encontrado.');
        this.carregando.set(false);
      },
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando.set(true);
    this.erroGeral.set('');

    const dados = this.form.getRawValue() as ProdutoRequest;
    const requisicao: Observable<unknown> = this.id()
      ? this.produtoService.alterar(this.id()!, dados)
      : this.produtoService.incluir(dados);

    requisicao.subscribe({
      // deu certo: mostra o aviso verde e volta para a lista
      next: () => {
        this.notificacao.sucesso(this.id() ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.');
        this.router.navigateByUrl('/admin/produtos');
      },
      error: (erro: HttpErrorResponse) => {
        this.aplicarErrosDaApi(erro);
        this.salvando.set(false);
      },
    });
  }

  private aplicarErrosDaApi(erro: HttpErrorResponse): void {
    const corpo = erro.error as ErroApi | null;

    if (erro.status === 400 && corpo?.errors?.length) {
      for (const erroCampo of corpo.errors) {
        const campo = this.form.get(erroCampo.field);
        if (campo) {
          campo.setErrors({ ...campo.errors, api: erroCampo.message });
          campo.markAsTouched();
        }
      }
      return;
    }

    this.erroGeral.set(corpo?.message ?? 'Não foi possível salvar. O back-end está rodando?');
  }

  mensagemErro(campo: string): string {
    const erros = this.form.get(campo)?.errors;
    if (!erros)
      return '';

    if (erros['required'] || erros['somenteEspacos'])
      return 'Campo obrigatório.';
    if (erros['minlength'])
      return `Use pelo menos ${erros['minlength'].requiredLength} caracteres.`;
    if (erros['maxlength'])
      return `Use no máximo ${erros['maxlength'].requiredLength} caracteres.`;
    if (erros['min'])
      return campo === 'preco' ? 'O preço deve ser maior que zero.' : 'O estoque não pode ser negativo.';
    if (erros['pattern'])
      return 'Use um número inteiro.';
    if (erros['api'])
      return erros['api'];

    return '';
  }
}