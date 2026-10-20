export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Valida um texto obrigatório e devolve o valor sem espaços nas pontas.
export function requiredText(value, label, max = 255) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `${label} é obrigatório.`);
  }
  if (value.trim().length > max) {
    throw new HttpError(400, `${label} deve ter no máximo ${max} caracteres.`);
  }
  return value.trim();
}

// CPF opcional: aceita "123.456.789-09" ou "12345678909", exige exatamente 11 dígitos
// e devolve só os dígitos (ou null se vazio).
export function optionalCpf(value) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || !/^[\d.\-\s]+$/.test(value)) {
    throw new HttpError(400, 'CPF inválido. Use apenas números (11 dígitos).');
  }
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 11) {
    throw new HttpError(400, 'CPF inválido. Informe os 11 dígitos.');
  }
  return digits;
}

export function oneOf(value, options, label) {
  if (!options.includes(value)) {
    throw new HttpError(400, `${label} inválido. Use: ${options.join(', ')}.`);
  }
  return value;
}

// 'CLI-101' -> 101 (o app trabalha com ids no formato de código).
export function parseCode(id, prefix) {
  const match = new RegExp(`^${prefix}-(\\d+)$`).exec(id);
  if (!match) throw new HttpError(404, 'Registro não encontrado.');
  return Number(match[1]);
}
