// Guarda o token de login no aparelho (localStorage fornecido pelo expo-sqlite; nativo na web).
import 'expo-sqlite/localStorage/install';

const KEY = 'telecomos.token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    // sem armazenamento: a sessão dura só até fechar o app
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nada a limpar
  }
}
