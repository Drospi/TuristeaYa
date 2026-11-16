import { useState } from 'react';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { FormField } from '@/components/ui/form-field';
import { useAuth } from '@/context/auth-context';

/** Pantalla 03 del prototipo: crear cuenta conectada a POST /api/v1/auth/register. */
export default function RegisterScreen() {
  const { register, busy } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(true);
  const [feedback, setFeedback] = useState('');

  async function handleRegister() {
    if (!name.trim()) {
      setFeedback('Escribe tu nombre completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFeedback('Escribe un correo electrónico válido.');
      return;
    }
    if (password.length < 8) {
      setFeedback('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirm) {
      setFeedback('Las contraseñas no coinciden.');
      return;
    }
    if (!accepted) {
      setFeedback('Debes aceptar los términos y privacidad para crear una cuenta.');
      return;
    }

    setFeedback('');
    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        acceptTerms: accepted,
      });
      if (result.requiresConfirmation) {
        setFeedback(
          result.message || 'Cuenta creada. Revisa tu correo para confirmar la cuenta.',
        );
      } else {
        router.replace('/turista');
      }
    } catch (err) {
      setFeedback(
        err instanceof Error
          ? err.message
          : 'No se pudo completar el registro. Inténtalo de nuevo.',
      );
    }
  }

  return (
    <Screen title="Crear cuenta" subtitle="Completa tus datos" extraEdges={['bottom']}>
      <FormField
        label="Nombre"
        placeholder="María"
        value={name}
        onChangeText={(v) => {
          setName(v);
          setFeedback('');
        }}
      />
      <FormField
        label="Correo electrónico"
        placeholder="maria@ejemplo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setFeedback('');
        }}
      />
      <FormField
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        secureTextEntry
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          setFeedback('');
        }}
      />
      <FormField
        label="Confirmar contraseña"
        placeholder="••••••••"
        secureTextEntry
        value={confirm}
        onChangeText={(v) => {
          setConfirm(v);
          setFeedback('');
        }}
      />
      <AppText variant="label">Aceptación</AppText>
      <Chip
        label="Acepto los términos y privacidad"
        selected={accepted}
        onPress={() => setAccepted((value) => !value)}
      />
      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}
      <Button
        title={busy ? 'Registrando…' : 'Registrarme'}
        disabled={busy}
        onPress={handleRegister}
      />
      <Button
        title="Ya tengo una cuenta"
        variant="secondary"
        disabled={busy}
        onPress={() => router.navigate('/login')}
      />
    </Screen>
  );
}
