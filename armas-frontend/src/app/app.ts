import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  // itens do menu: rota = endereço, icone = nome do ícone do Material
    catalogo = [
    { rota: '/admin/dashboard', rotulo: 'Dashboard', icone: 'bar_chart' },
    { rota: '/admin/produtos', rotulo: 'Cadastro de produtos', icone: 'inventory_2' },
    { rota: '/admin/marcas', rotulo: 'Cadastro de marcas', icone: 'shield' },
  ];

  pessoas = [
    { rota: '/admin/clientes', rotulo: 'Gestão de clientes', icone: 'person' },
  ];
}