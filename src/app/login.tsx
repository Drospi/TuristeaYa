import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';

/** Pantalla 02 del prototipo: iniciar sesión. */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToTuristaHome = () => router.navigate('/turista');

  return (
    <Screen title="Iniciar sesión" subtitle="Bienvenido a TuristeaYA" extraEdges={['bottom']}>
      <FormField
        label="Correo electrónico"
        placeholder="usuario@ejemplo.com"
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
      <Button title="Ingresar" onPress={goToTuristaHome} />
      <Button
        title="Crear una cuenta"
        variant="secondary"
        onPress={() => router.navigate('/register')}
      />
      <Button title="Continuar como invitado" variant="secondary" onPress={goToTuristaHome} />
      <Button title="Volver a los recorridos" variant="secondary" onPress={() => router.navigate('/')} />
    </Screen>
  );
}
