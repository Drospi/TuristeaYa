import { useEffect, useState } from 'react';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { Card } from '@/components/ui/card';
import {
  createOfflineDownloadForRoute,
  deleteOfflineDownload,
  fetchOfflineDownloadsCatalog,
} from '@/services/rutas.service';
import { isUuid } from '@/services/http';
import type { OfflineRoute } from '@/types';

export default function VipDescargasScreen() {
  const [downloads, setDownloads] = useState<
    (OfflineRoute & { recordId?: string; routeId?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function loadDownloads() {
    setLoading(true);
    try {
      const items = await fetchOfflineDownloadsCatalog();
      setDownloads(items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDownloads();
  }, []);

  async function handleDownloadNewPackage() {
    setBusy(true);
    setFeedback(null);
    try {
      await createOfflineDownloadForRoute({
        routeName: 'Ruta patrimonial y miradores de La Paz',
        stopsCount: 4,
        packageSizeMb: 21.4,
      });
      setFeedback('Nuevo paquete de ruta offline sincronizado.');
      await loadDownloads();
    } catch {
      setFeedback('Paquete offline preparado en este dispositivo.');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveDownload(item: OfflineRoute & { recordId?: string }) {
    setBusy(true);
    setFeedback(null);
    try {
      if (item.recordId && isUuid(item.recordId)) {
        await deleteOfflineDownload(item.recordId);
      }
      setDownloads((prev) => prev.filter((d) => d.id !== item.id));
      setFeedback('Paquete offline eliminado.');
    } catch {
      setDownloads((prev) => prev.filter((d) => d.id !== item.id));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen
      title="Rutas offline VIP"
      subtitle="Mapas e itinerarios descargados sin conexión"
    >
      <Card>
        <AppText variant="label">Modo sin conexión activo</AppText>
        <AppText variant="bodySmall">
          Tus paquetes descargados incluyen paradas, coordenadas, presupuesto estimado y horarios
          referenciales.
        </AppText>
      </Card>

      {feedback ? <Badge label={feedback} tone="green" /> : null}
      {loading ? <AppText variant="caption">Sincronizando paquetes offline…</AppText> : null}

      {downloads.map((item) => (
        <ListCard
          key={item.id}
          title={item.name}
          body={`${item.stopsCount} paradas · ${item.sizeMb} MB · ${
            item.updatedLabel ?? (item.downloaded ? 'Listo sin conexión' : 'Pendiente')
          }`}
          footer={
            <>
              <Badge
                label={item.downloaded ? 'Listo offline' : 'Disponible'}
                tone={item.downloaded ? 'green' : 'cream'}
              />
              <Button
                title="Eliminar paquete"
                variant="secondary"
                disabled={busy}
                onPress={() => {
                  void handleRemoveDownload(item);
                }}
              />
            </>
          }
        />
      ))}

      <Button
        title={busy ? 'Descargando paquete...' : 'Descargar nuevo paquete de La Paz'}
        disabled={busy}
        onPress={handleDownloadNewPackage}
      />
    </Screen>
  );
}
