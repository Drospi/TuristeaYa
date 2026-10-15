import { router } from 'expo-router';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { ListCard } from '@/components/ui/list-card';
import { RecommendationCarousel } from '@/features/turista/components/recommendation-carousel';
import { RouteStatus } from '@/features/turista/components/route-status';
import { useDiscovery } from '@/features/turista/discovery-context';
import { outingNotices } from '@/features/turista/data/discovery';
import { useSelectedLocation } from '@/features/turista/location-context';
import { useRoutes } from '@/features/turista/route-context';
import { formatDuration } from '@/utils/format';
export default function InicioScreen() {
  const { location } = useSelectedLocation();
  const { readNotices } = useDiscovery();
  const { routes } = useRoutes();
  const unreadCount = outingNotices.filter((notice) => !readNotices.includes(notice.id)).length;
  return <Screen title="Inicio" subtitle={location.label === 'Centro de La Paz' ? 'La Paz · Centro' : location.label}>
    <Button align="left" title="Cambiar ubicación" variant="secondary" onPress={() => router.navigate('/turista/ubicacion')} />
    <Button align="left" title="Crear una ruta" onPress={() => router.navigate('/turista/crear-ruta')} />
    <AppText variant="body">Descubre lugares reales de La Paz</AppText>
    <ListCard title="Encuentra tu recorrido" body="Combina gastronomía, cultura y naturaleza con tu tiempo y presupuesto." onPress={() => router.navigate('/turista/crear-ruta')} />
    <ListCard title="Café del Mundo" body="Calle Sagárnaga · Ver información, mapa y guardar en una ruta" onPress={() => router.navigate('/turista/lugar/cafe-del-mundo')} />
    <ListCard title="Avisos de mi salida" body={unreadCount ? `${unreadCount} avisos sin leer · Revisa las novedades.` : 'Estás al día · Ver avisos.'} onPress={() => router.navigate('/turista/notificaciones')} />
    <RecommendationCarousel />
    <RouteStatus />
    {routes.length ? <AppText variant="section">Mis rutas guardadas</AppText> : null}
    {routes.slice(0, 3).map((route) => <ListCard key={route.id} title={route.name} body={`${route.placeIds.length} paradas · ${formatDuration(route.durationMin)} aprox.${route.visited ? ' · Visitada' : ''}`} onPress={() => router.navigate(`/turista/ruta/${route.id}`)} />)}
    <Button title="Ver Mis rutas" variant="secondary" onPress={() => router.navigate('/turista/mis-rutas')} />
  </Screen>;
}
