import { useEffect, useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import { checkBackendHealth } from '@/services/http';

/**
 * Pantalla 01 del prototipo: entrada y selector de rol.
 * En la app real cada cuenta tendría sus propios permisos;
 * el selector se mantiene para la demostración.
 */
export default function RoleSelectorScreen() {
  const { session, user } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'waking'>('checking');

  useEffect(() => {
    let active = true;
    checkBackendHealth()
      .then((res) => {
        if (active) setBackendStatus(res.status === 'ok' ? 'online' : 'waking');
      })
      .catch(() => {
        if (active) setBackendStatus('waking');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Screen
      title="TuristeaYA"
      subtitle="Prototipo móvil · Selecciona un recorrido"
      showBack={false}
      extraEdges={['bottom']}
    >
      <Badge
        label={
          backendStatus === 'online'
            ? 'Backend conectado · Supabase activo'
            : backendStatus === 'checking'
              ? 'Conectando con backend-turisteaya…'
              : 'Modo resiliente · Backend en espera'
        }
        tone={backendStatus === 'online' ? 'green' : 'cream'}
      />
      {session ? (
        <AppText variant="caption">
          Sesión activa: {user.name} ({session.email})
        </AppText>
      ) : null}
      <AppText variant="body">
        {'Planifica una salida según tu tiempo, ubicación\ny presupuesto.'}
      </AppText>
      <Button
        title={session ? 'Continuar como turista' : 'Entrar como turista'}
        onPress={() => router.navigate(session ? '/turista' : '/login')}
      />
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
