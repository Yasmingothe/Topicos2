// regra única de "estoque baixo" para o sistema todo (dashboard, lista e detalhe de produto).
// arma costuma ficar com poucas unidades na loja, então baixo = 3 unidades ou menos
export const ESTOQUE_BAIXO = 3;

export function estoqueBaixo(estoque: number): boolean {
  return estoque > 0 && estoque <= ESTOQUE_BAIXO;
}
