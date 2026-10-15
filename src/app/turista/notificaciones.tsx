import { router } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { outingNotices, findDiscoveryPlace } from '@/features/turista/data/discovery';
import { useDiscovery } from '@/features/turista/discovery-context';
import { colors } from '@/theme';

export default function NotificacionesScreen() {
  const { readNotices, markRead } = useDiscovery();
  const unread = outingNotices.filter((notice) => !readNotices.includes(notice.id));
  return (
    <Screen title="Avisos de mi salida" subtitle={unread.length ? `${unread.length} avisos sin leer` : 'Estás al día'}>
      <AppText variant="bodySmall">Avisos de ejemplo para el recorrido por el centro. No son alertas en tiempo real.</AppText>
      {outingNotices.map((notice) => {
        const read = readNotices.includes(notice.id);
        return <ListCard key={notice.id} title={notice.title} body={notice.text}
          style={{ borderColor: read ? colors.border : colors.primary }}
          footer={<>
            <AppText variant="caption">{read ? 'Leído' : 'Nuevo'} · {findDiscoveryPlace(notice.placeId)?.name}</AppText>
            <Button align="left" variant="secondary" title={notice.action} onPress={() => { markRead([notice.id]); router.navigate(`/turista/lugar/${notice.placeId}`); }} />
            {!read ? <Button align="left" variant="soft" size="sm" title="Marcar como leído" onPress={() => markRead([notice.id])} /> : null}
          </>} />;
      })}
      <Button align="left" title="Marcar todos como leídos" disabled={!unread.length} onPress={() => markRead(outingNotices.map((notice) => notice.id))} />
      <Button align="left" title="Volver a Inicio" variant="secondary" onPress={() => router.navigate('/turista')} />
    </Screen>
  );
}
