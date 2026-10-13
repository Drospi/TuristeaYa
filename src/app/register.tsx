import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { FormField } from '@/components/ui/form-field';

/** Pantalla 03 del prototipo: crear cuenta. */
export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(true);

  return (
    <Screen title="Crear cuenta" subtitle="Completa tus datos" extraEdges={['bottom']}>
      <FormField label="Nombre" placeholder="María" value={name} onChangeText={setName} />
      <FormField
        label="Correo electrónico"
        placeholder="maria@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <FormField
        label="Contraseña"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <FormField
        label="Confirmar contraseña"
        placeholder="••••••••"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <AppText variant="label">Aceptación</AppText>
      <Chip
        label="Acepto los términos y privacidad"
        selected={accepted}
        onPress={() => setAccepted((value) => !value)}
      />
      <Button title="Registrarme" onPress={() => router.navigate('/turista')} />
      <Button
        title="Ya tengo una cuenta"
        variant="secondary"
        onPress={() => router.navigate('/login')}
      />
    </Screen>
  );
}
