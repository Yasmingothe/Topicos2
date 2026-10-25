export interface Categoria {
  codigo: string;
  nome: string;
  controlada: boolean; // true = arma ou munição: exige autorização de compra
}
