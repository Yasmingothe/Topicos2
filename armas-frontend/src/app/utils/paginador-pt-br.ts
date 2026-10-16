import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

// troca os textos em inglês do paginador por português
@Injectable()
export class PaginadorPtBr extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Itens por página';
  override nextPageLabel = 'Próxima página';
  override previousPageLabel = 'Página anterior';

  override getRangeLabel = (pagina: number, tamanho: number, total: number): string => {
    if (total === 0)
      return '0 de 0';
    const inicio = pagina * tamanho;
    const fim = Math.min(inicio + tamanho, total);
    return `${inicio + 1} – ${fim} de ${total}`;
  };
}