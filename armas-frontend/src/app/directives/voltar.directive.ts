import { Directive, HostListener, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

// Coloque appVoltar num botão para ele VOLTAR para a tela anterior (igual à seta do navegador).
// Se a pessoa abriu a tela direto pelo endereço (não tem tela anterior), vai para o endereço informado.
// Uso: <button appVoltar="/admin/notas">Cancelar</button>
@Directive({ selector: '[appVoltar]' })
export class VoltarDirective {

  private location = inject(Location);
  private router = inject(Router);

  appVoltar = input<string>('/'); // para onde ir se não houver tela anterior

  @HostListener('click', ['$event'])
  aoClicar(evento: Event): void {
    evento.preventDefault();
    voltar(this.router, this.location, this.appVoltar());
  }
}

// também dá para usar direto no código (ex.: depois de salvar)
export function voltar(router: Router, location: Location, seNaoTiver: string): void {
  const teveTelaAnterior = !!router.lastSuccessfulNavigation()?.previousNavigation;
  if (teveTelaAnterior) location.back();
  else router.navigateByUrl(seNaoTiver);
}
