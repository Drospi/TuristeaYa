import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { useRoutes } from '../route-context';
export function RouteStatus() {
  const { ready, busy, error, repository } = useRoutes();
  return <>
    {!ready && !error ? <AppText variant="caption">Cargando rutas guardadas…</AppText> : null}
    {busy ? <AppText variant="caption">Guardando cambios…</AppText> : null}
    {error ? <AppText variant="bodySmall" accessibilityLiveRegion="polite">{error}</AppText> : null}
    {!ready && error ? <Button title="Volver a cargar rutas" onPress={() => { void repository.load(); }} /> : null}
  </>;
}
