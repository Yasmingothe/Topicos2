import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { Categoria } from '../models/categoria.model';
import { Produto } from '../models/produto.model';
import { AuthService } from './auth.service';

export interface ItemCarrinho {
  idProduto: number;
  nome: string;
  marca: string;
  preco: number;
  categoria: Categoria;
  calibre: string | null;
  temImagem: boolean;
  imagemUrl: string | null;
  estoque: number;
  quantidade: number;
}

// cada conta tem o seu carrinho guardado no navegador:
//   zero1.carrinho.7          -> carrinho do usuário de id 7
//   zero1.carrinho.visitante  -> carrinho de quem ainda não entrou
const PREFIXO = 'zero1.carrinho.';
const VISITANTE = 'visitante';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {

  private auth = inject(AuthService);

  // de quem é o carrinho que está na tela agora
  private dono = VISITANTE;

  itens = signal<ItemCarrinho[]>([]);

  quantidadeTotal = computed(() => this.itens().reduce((soma, i) => soma + i.quantidade, 0));
  total = computed(() => this.itens().reduce((soma, i) => soma + i.preco * i.quantidade, 0));
  temControlado = computed(() => this.itens().some((i) => i.categoria.controlada));

  constructor() {
    // effect = roda de novo sempre que o usuário logado muda (entrou, saiu, trocou de conta)
    effect(() => {
      const idUsuario = this.auth.usuario()?.id ?? null;
      untracked(() => this.trocarDono(idUsuario));
    });
  }

  // devolve false se não couber no estoque
  adicionar(produto: Produto, quantidade = 1): boolean {
    if (this.auth.ehAdmin()) return false; // admin só visualiza a loja
    const existente = this.itens().find((i) => i.idProduto === produto.id);
    const nova = (existente?.quantidade ?? 0) + quantidade;
    if (nova > produto.estoque) return false;

    if (existente) {
      this.alterar(produto.id, nova);
    } else {
      this.salvar([...this.itens(), {
        idProduto: produto.id,
        nome: produto.nome,
        marca: produto.marca.nome,
        preco: produto.preco,
        categoria: produto.categoria,
        calibre: produto.calibre,
        temImagem: produto.temImagem,
        imagemUrl: produto.imagemUrl,
        estoque: produto.estoque,
        quantidade,
      }]);
    }
    return true;
  }

  alterar(idProduto: number, quantidade: number): void {
    this.salvar(this.itens().map((i) =>
      i.idProduto === idProduto ? { ...i, quantidade: Math.max(1, Math.min(quantidade, i.estoque)) } : i));
  }

  remover(idProduto: number): void {
    this.salvar(this.itens().filter((i) => i.idProduto !== idProduto));
  }

  limpar(): void {
    this.salvar([]);
  }

  // ===== troca de conta =====
  private trocarDono(idUsuario: number | null): void {
    if (idUsuario === null) {
      // saiu da conta: mostra o carrinho de visitante (vazio).
      // o carrinho da pessoa continua guardado e volta quando ela entrar de novo
      this.dono = VISITANTE;
      this.itens.set(this.ler(VISITANTE));
      return;
    }

    // entrou: pega o carrinho da conta e junta o que ela colocou antes de entrar
    this.dono = String(idUsuario);
    const daConta = this.ler(this.dono);
    const deVisitante = this.ler(VISITANTE);

    for (const item of deVisitante) {
      const igual = daConta.find((i) => i.idProduto === item.idProduto);
      if (igual) igual.quantidade = Math.min(igual.quantidade + item.quantidade, item.estoque);
      else daConta.push(item);
    }

    this.apagar(VISITANTE);
    this.salvar(daConta);
  }

  private salvar(itens: ItemCarrinho[]): void {
    this.itens.set(itens);
    try {
      localStorage.setItem(PREFIXO + this.dono, JSON.stringify(itens));
    } catch {
      // sem armazenamento (aba anônima): o carrinho vale só enquanto a página está aberta
    }
  }

  private ler(dono: string): ItemCarrinho[] {
    try {
      return JSON.parse(localStorage.getItem(PREFIXO + dono) ?? '[]') as ItemCarrinho[];
    } catch {
      return [];
    }
  }

  private apagar(dono: string): void {
    try {
      localStorage.removeItem(PREFIXO + dono);
    } catch {
      // nada a fazer
    }
  }
}
