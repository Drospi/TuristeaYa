import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { useAuth } from '@/context/auth-context';

/** Pantalla 02 del prototipo: iniciar sesión conectada a POST /api/v1/auth/login. */
export default function LoginScreen() {
  const { login, busy } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const goToTuristaHome = () => router.navigate('/turista');

  async function handleLogin() {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setFeedback('Ingresa tu correo electrónico y contraseña.');
      return;
    }
    setFeedback('');
    try {
      const role = await login(cleanEmail, password);
      if (role === 'admin') router.replace('/admin');
      else if (role === 'soporte') router.replace('/soporte');
      else if (role === 'negocio') router.replace('/negocio');
      else if (role === 'vip') router.replace('/vip');
      else router.replace('/turista');
    } catch (err) {
      setFeedback(
        err instanceof Error
          ? err.message
          : 'Correo o contraseña incorrectos, o la cuenta requiere confirmación.',
      );
    }
  }

  return (
    <Screen title="Iniciar sesión" subtitle="Bienvenido a TuristeaYA" extraEdges={['bottom']}>
      <FormField
        label="Correo electrónico"
        placeholder="usuario@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setFeedback('');
        }}
      />
      <FormField
        label="Contraseña"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setFeedback('');
        }}
      />
      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}
      <Button
        title={busy ? 'Ingresando…' : 'Ingresar'}
        disabled={busy}
        onPress={handleLogin}
      />
      <Button
        title="Crear una cuenta"
        variant="secondary"
        disabled={busy}
        onPress={() => router.navigate('/register')}
      />
      <Button
        title="Continuar como invitado"
        variant="secondary"
        disabled={busy}
        onPress={goToTuristaHome}
      />
      <Button
        title="Volver a los recorridos"
        variant="secondary"
        disabled={busy}
        onPress={() => router.navigate('/')}
      />
    </Screen>
  );
}
