import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './cadastro.html',
  styleUrl: '../auth.css',
})
export class Cadastro implements OnInit {
  private auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.cadastrar();
  }

  criar(): void {
    this.auth.cadastrar();
  }
}
