// funções pequenas para mostrar dados do jeito brasileiro

const moedaBr = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function moeda(valor: number | null | undefined): string {
  return moedaBr.format(valor ?? 0);
}

// "2026-10-10" -> "10/10/2026"
export function data(iso: string | null | undefined): string {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.substring(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

// "2026-10-10T14:32:00" -> "10/10/2026 às 14:32"
export function dataHora(iso: string | null | undefined): string {
  if (!iso) return '—';
  return `${data(iso)} às ${iso.substring(11, 16)}`;
}

export function cpf(valor: string): string {
  return (valor ?? '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function cnpj(valor: string): string {
  return (valor ?? '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function telefone(valor: string | null): string {
  return (valor ?? '').replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
}

export function soNumeros(texto: string | null | undefined): string {
  return (texto ?? '').replace(/\D/g, '');
}

// data de hoje no formato do input type="date" (aaaa-mm-dd)
export function hojeIso(): string {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

// cor do selinho para cada situação
export function corSituacao(codigo: string): string {
  switch (codigo) {
    case 'PAGO': return 'azul';
    case 'SEPARANDO': return 'laranja';
    case 'PRONTO_RETIRADA': return 'laranja';
    case 'ENTREGUE': return 'verde';
    case 'CANCELADO': return 'vermelho';
    case 'APROVADA': return 'verde';
    case 'EM_ANALISE': return 'laranja';
    case 'RECUSADA': return 'vermelho';
    default: return '';
  }
}
