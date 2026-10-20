import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

// Carrega uma lista toda vez que a tela ganha foco (ex.: ao voltar do cadastro).
// `load` deve ser uma função estável (definida fora do componente).
export function useAsyncList<T>(load: () => Promise<T[]>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      setItems(await load());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return { items, loading, error, refresh };
}
