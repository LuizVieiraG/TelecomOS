export const CPF_LENGTH = 11;

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

// Aplica a máscara 000.000.000-00 enquanto o usuário digita; ignora tudo além de 11 dígitos.
export function formatCpf(value: string | undefined): string {
  const digits = onlyDigits(value ?? '').slice(0, CPF_LENGTH);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)];
  const last = digits.slice(9, 11);

  let masked = parts[0];
  if (digits.length > 3) masked += `.${parts[1]}`;
  if (digits.length > 6) masked += `.${parts[2]}`;
  if (digits.length > 9) masked += `-${last}`;
  return masked;
}

// Vazio é aceito (CPF opcional); se preenchido, precisa ter exatamente 11 dígitos.
export const isValidCpfLength = (value: string) =>
  value === '' || onlyDigits(value).length === CPF_LENGTH;
