export function exportarCsv(nomeArquivo: string, cabecalho: string[], linhas: (string | number)[][]): void {
  const escapar = (valor: string | number) => `"${String(valor ?? '').replace(/"/g, '""')}"`;

  const conteudo = [cabecalho, ...linhas]
    .map((linha) => linha.map(escapar).join(';'))
    .join('\r\n');

  const arquivo = new Blob(['\uFEFF' + conteudo], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(arquivo);
  link.download = `${nomeArquivo}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}