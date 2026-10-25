import { AbstractControl, ValidationErrors } from '@angular/forms';
import { soNumeros } from './formatar';

export function naoSomenteEspacos(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  return valor && valor.trim().length === 0 ? { somenteEspacos: true } : null;
}

// confere os 2 dígitos verificadores do CPF
export function cpfValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;

  const cpf = soNumeros(valor);
  if (/[^\d.\-]/.test(valor) || cpf.length !== 11) return { cpfFormato: true };
  if (/^(\d)\1{10}$/.test(cpf)) return { cpfInvalido: true };

  for (let posicao = 9; posicao <= 10; posicao++) {
    let soma = 0;
    for (let i = 0; i < posicao; i++) soma += Number(cpf[i]) * (posicao + 1 - i);
    let digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;
    if (digito !== Number(cpf[posicao])) return { cpfInvalido: true };
  }
  return null;
}

// confere os 2 dígitos verificadores do CNPJ
export function cnpjValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;

  const cnpj = soNumeros(valor);
  if (/[^\d.\-/]/.test(valor) || cnpj.length !== 14) return { cnpjFormato: true };
  if (/^(\d)\1{13}$/.test(cnpj)) return { cnpjInvalido: true };

  const calcular = (pesos: number[]) => {
    const soma = pesos.reduce((total, peso, i) => total + Number(cnpj[i]) * peso, 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const d1 = calcular([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcular([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]) ? null : { cnpjInvalido: true };
}

export function telefoneValido(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  const tamanho = soNumeros(valor).length;
  return tamanho === 10 || tamanho === 11 ? null : { telefone: true };
}

// data de nascimento no passado e idade mínima de 18 anos
export function dataNascimentoValida(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  const idade = idadeEm(valor);
  if (idade === null) return { dataFutura: true };
  return idade < 18 ? { menorDeIdade: true } : null;
}

// idade de quem nasceu em "aaaa-mm-dd" (null se a data for hoje ou futura)
export function idadeEm(nascimentoIso: string): number | null {
  const [ano, mes, dia] = nascimentoIso.split('-').map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  if (nascimento >= hoje) return null;

  let idade = hoje.getFullYear() - ano;
  const jaFezAniversario = hoje.getMonth() > mes - 1 || (hoje.getMonth() === mes - 1 && hoje.getDate() >= dia);
  if (!jaFezAniversario) idade--;
  return idade;
}

export function dataNaoFutura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  const hoje = new Date();
  const [ano, mes, dia] = valor.split('-').map(Number);
  return new Date(ano, mes - 1, dia) > hoje ? { dataFutura: true } : null;
}

export function dataFutura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) return null;
  const hoje = new Date();
  hoje.setHours(23, 59, 59, 0);
  const [ano, mes, dia] = valor.split('-').map(Number);
  return new Date(ano, mes - 1, dia) > hoje ? null : { dataPassada: true };
}
