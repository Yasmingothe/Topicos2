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
import { ProdutoImagem } from '../../shared/produto-imagem';

function naoSomenteEspacos(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  return valor && valor.trim().length === 0 ? { somenteEspacos: true } : null;
}

import { VoltarDirective } from '../../../directives/voltar.directive';

@Component({
  selector: 'app-produto-form',
  imports: [VoltarDirective, 
    ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, ProdutoImagem,
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
  duplicando = signal(false);
  carregando = signal(false);
  salvando = signal(false);
  erroGeral = signal('');

  // estoque e foto: só leitura aqui (estoque muda pela nota; foto tem botão próprio)
  estoqueAtual = signal<number | null>(null);
  temImagem = signal(false);
  versaoImagem = signal('');
  enviandoImagem = signal(false);

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
    descricao: this.fb.nonNullable.control('', Validators.maxLength(1000)),
    publicado: this.fb.nonNullable.control(true),
    imagemUrl: this.fb.nonNullable.control('', [Validators.maxLength(500), Validators.pattern(/^(https?:\/\/\S+)?$/)]),
  });

  ngOnInit(): void {
    this.marcaService.listar('', 0, 100).subscribe((pagina) => this.marcas.set(pagina.items));
    this.categoriaService.listar().subscribe((lista) => this.categorias.set(lista));

    // editar = /editar/5 (tem "id") | duplicar = /duplicar/5 (tem "idOrigem")
    const idEditar = this.route.snapshot.paramMap.get('id');
    const idOrigem = this.route.snapshot.paramMap.get('idOrigem');
    const idParaCarregar = idEditar ?? idOrigem;

    if (!idParaCarregar)
      return; // cadastro novo: formulário vazio

    if (idEditar)
      this.id.set(Number(idEditar));      // editar: salva em cima do mesmo produto
    else
      this.duplicando.set(true);          // duplicar: id continua vazio, então salva como NOVO

    this.carregando.set(true);

    this.produtoService.buscarPorId(Number(idParaCarregar)).subscribe({
      next: (produto) => {
        this.form.patchValue({
          nome: this.duplicando() ? `${produto.nome} (cópia)` : produto.nome,
          idMarca: produto.marca.id ?? null,
          categoria: produto.categoria.codigo,
          calibre: produto.calibre ?? '',
          preco: produto.preco,
          descricao: produto.descricao ?? '',
          // a cópia começa como rascunho, para não publicar sem querer
          publicado: this.duplicando() ? false : produto.publicado,
          imagemUrl: produto.imagemUrl ?? '',
        });
        if (!this.duplicando()) {
          this.estoqueAtual.set(produto.estoque);
          this.temImagem.set(produto.temImagem);
        }
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
      next: (resposta) => {
        if (this.id()) {
          this.notificacao.sucesso('Produto atualizado com sucesso.');
          this.router.navigateByUrl('/admin/produtos');
          return;
        }
        // produto novo: abre a edição para poder enviar a foto (a foto precisa do id)
        const criado = resposta as { id: number };
        this.notificacao.sucesso('Produto cadastrado. Agora você pode enviar a foto.');
        this.router.navigate(['/admin/produtos/editar', criado.id]);
      },
      error: (erro: HttpErrorResponse) => {
        this.aplicarErrosDaApi(erro);
        this.salvando.set(false);
      },
    });
  }

  // ===== FOTO =====
  escolherImagem(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const arquivo = campo.files?.[0];
    campo.value = ''; // permite escolher o mesmo arquivo de novo
    if (!arquivo || !this.id()) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
      this.notificacao.erro('Envie uma imagem JPG, PNG ou WEBP.');
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      this.notificacao.erro('A imagem deve ter no máximo 5 MB.');
      return;
    }

    this.enviandoImagem.set(true);
    this.produtoService.enviarImagem(this.id()!, arquivo).subscribe({
      next: () => {
        this.temImagem.set(true);
        this.versaoImagem.set(String(Date.now()));
        this.enviandoImagem.set(false);
        this.notificacao.sucesso('Foto enviada.');
      },
      error: (erro: HttpErrorResponse) => {
        this.enviandoImagem.set(false);
        this.notificacao.erro((erro.error as ErroApi | null)?.message ?? 'Não foi possível enviar a foto.');
      },
    });
  }

  removerImagem(): void {
    if (!this.id()) return;
    this.produtoService.removerImagem(this.id()!).subscribe({
      next: () => {
        this.temImagem.set(false);
        this.notificacao.sucesso('Foto removida. A loja volta a mostrar o desenho da categoria.');
      },
      error: () => this.notificacao.erro('Não foi possível remover a foto.'),
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
      return 'O preço deve ser maior que zero.';
    if (erros['pattern'] && campo === 'imagemUrl')
      return 'O link deve começar com http:// ou https://.';
    if (erros['api'])
      return erros['api'];

    return '';
  }
}