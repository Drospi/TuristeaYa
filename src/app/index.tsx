import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';

/**
 * Pantalla 01 del prototipo: entrada y selector de rol.
 * En la app real cada cuenta tendría sus propios permisos;
 * el selector se mantiene para la demostración.
 */
export default function RoleSelectorScreen() {
  return (
    <Screen title="TuristeaYA" subtitle="Prototipo móvil · Selecciona un recorrido" showBack={false} extraEdges={['bottom']}>
      <AppText variant="body">
        {'Planifica una salida según tu tiempo, ubicación\ny presupuesto.'}
      </AppText>
      <Button title="Entrar como turista" onPress={() => router.navigate('/login')} />
      <Button title="Ver usuario VIP" variant="secondary" onPress={() => router.navigate('/vip')} />
      <Button
        title="Ver panel del negocio"
        variant="secondary"
        onPress={() => router.navigate('/negocio')}
      />
      <Button title="Ver soporte" variant="secondary" onPress={() => router.navigate('/soporte')} />
      <Button
        title="Ver administrador"
        variant="secondary"
        onPress={() => router.navigate('/admin')}
      />
      <AppText variant="body" style={{ marginTop: 24 }}>
        {
          'Los roles se muestran juntos solo para la\nexposición. En la aplicación, cada cuenta\ntendría sus permisos.'
        }
      </AppText>
    </Screen>
  );
}
