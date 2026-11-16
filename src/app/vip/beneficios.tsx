import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { fetchVipBenefitHistory } from '@/services/cupones.service';
import type { BenefitHistoryEntry } from '@/types';

export default function VipBeneficiosScreen() {
  const [history, setHistory] = useState<BenefitHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    setLoading(true);
    try {
      const items = await fetchVipBenefitHistory();
      setHistory(items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadHistory();
  }, []);

  return (
    <Screen
      title="Beneficios VIP"
      subtitle="Historial de cupones canjeados y reservas exclusivas"
    >
      {loading ? <AppText variant="caption">Sincronizando beneficios VIP…</AppText> : null}

      {history.map((entry) => (
        <ListCard
          key={entry.id}
          title={entry.title}
          body={`${entry.detail} · ${entry.usedLabel}`}
          footer={<Badge label="Beneficio aplicado" tone="green" />}
        />
      ))}

      <Button
        title="Ver cupones disponibles"
        onPress={() => router.navigate('/turista/cupones')}
      />
      <Button
        title="Actualizar historial"
        variant="secondary"
        onPress={() => {
          void loadHistory();
        }}
      />
    </Screen>
  );
}
