import { useEffect, useState } from 'react';

/**
 * Consume un método del servicio de datos.
 * Devuelve null mientras resuelve; los mocks son inmediatos.
 * Al reemplazar los mocks por una API real, las pantallas
 * siguen usando este mismo hook.
 */
export function useApiData<T>(fetcher: () => Promise<T>): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let active = true;
    fetcher().then((result) => {
      if (active) setData(result);
    });
    return () => {
      active = false;
    };
  }, [fetcher]);

  return data;
}
