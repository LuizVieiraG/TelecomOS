// Cliente HTTP da Web API REST do TelecomOS (Node + Express + MySQL, pasta /server).
// Verbos usados: GET (listar/buscar), POST (criar), PATCH (atualizar), DELETE (remover).
import { Platform } from 'react-native';
import { clearToken, getToken } from '@/lib/session';

// Emulador Android enxerga o PC em 10.0.2.2. Em celular físico, defina EXPO_PUBLIC_API_URL
// com o IP do PC na rede (ex.: http://192.168.0.10:3000).
const DEFAULT_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_URL).replace(/\/$/, '');

const TIMEOUT_MS = 10000;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// Chamado quando um token salvo deixa de ser aceito (expirado ou usuário removido).
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const token = getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(`Sem conexão com a API (${API_URL}). Verifique se o servidor está rodando.`);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let message = `Erro ${response.status} na requisição.`;
    try {
      const data = await response.json();
      if (data?.message) message = data.message;
    } catch {
      // corpo sem JSON: mantém a mensagem padrão
    }
    if (response.status === 401 && token) {
      clearToken();
      onUnauthorized?.();
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
