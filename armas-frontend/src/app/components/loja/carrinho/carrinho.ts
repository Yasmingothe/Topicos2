import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { CarrinhoService } from '../../../services/carrinho.service';
import { moeda } from '../../../utils/formatar';
import { ProdutoImagem } from '../../shared/produto-imagem';

@Component({
  selector: 'app-carrinho',
  imports: [RouterLink, MatButtonModule, MatIconModule, ProdutoImagem],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho {
  carrinho = inject(CarrinhoService);
  auth = inject(AuthService);
  moeda = moeda;
}
