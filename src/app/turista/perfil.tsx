import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { router } from 'expo-router';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { useAuth } from '@/context/auth-context';
import { listRecords } from '@/services/http';
import {
  createTicketRecord,
  createUserInterest,
  deleteUserInterest,
  listUserInterests,
} from '@/services/usuarios.service';
import { spacing } from '@/theme';
import type { DbCategory, DbUserInterest } from '@/types/database';

/** Pantalla 24 del prototipo: Perfil del turista conectado a /api/v1/me, /profiles y /user-interests. */
export default function TuristaPerfilScreen() {
  const {
    session,
    user,
    profile,
    subscription,
    busy,
    logout,
    saveProfileChanges,
    refreshProfile,
  } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? user.name);
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [interests, setInterests] = useState<DbUserInterest[]>([]);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setFullName(profile?.full_name ?? user.name);
    setPhone(profile?.phone ?? '');
  }, [profile?.full_name, profile?.phone, user.name]);

  const loadInterestsData = useCallback(async () => {
    try {
      const targetUserId = profile?.id ?? session?.userId;
      const [cats, userInts] = await Promise.all([
        listRecords<DbCategory>('categories', { limit: 50 }).catch(() => [] as DbCategory[]),
        listUserInterests(targetUserId ? { user_id: targetUserId } : undefined, {
          limit: 50,
        }).catch(() => [] as DbUserInterest[]),
      ]);
      setCategories(cats);
      setInterests(userInts);
    } catch {
      // Silencioso en modo invitado
    }
  }, [profile?.id, session?.userId]);

  useEffect(() => {
    void loadInterestsData();
  }, [loadInterestsData]);

  async function handleSaveProfile() {
    if (!fullName.trim()) {
      setFeedback('El nombre completo no puede estar vacío.');
      return;
    }
    setFeedback('');
    try {
      const updated = await saveProfileChanges({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
      });
      if (updated) {
        setFeedback('Perfil actualizado en el servidor.');
      } else {
        setFeedback('Inicia sesión para guardar cambios en tu perfil de Supabase.');
      }
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'No se pudo guardar el perfil.');
    }
  }

  async function toggleCategoryInterest(category: DbCategory) {
    const targetUserId = profile?.id ?? session?.userId;
    if (!targetUserId) {
      setFeedback('Inicia sesión para sincronizar tus intereses con tu cuenta.');
      return;
    }
    const existing = interests.find(
      (item) => item.category_id === category.id && item.user_id === targetUserId,
    );
    setFeedback('');
    try {
      if (existing) {
        await deleteUserInterest(existing.id);
        setInterests((prev) => prev.filter((item) => item.id !== existing.id));
      } else {
        const created = await createUserInterest({
          user_id: targetUserId,
          category_id: category.id,
        });
        setInterests((prev) => [...prev, created]);
      }
      await refreshProfile();
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudieron actualizar tus intereses.',
      );
    }
  }

  async function handleCreateSupportTicket() {
    const targetUserId = profile?.id ?? session?.userId;
    if (!ticketSubject.trim() || !ticketBody.trim()) {
      setFeedback('Completa el asunto y la descripción del problema.');
      return;
    }
    if (!targetUserId) {
      setFeedback('Inicia sesión para enviar un ticket a soporte.');
      return;
    }
    setFeedback('');
    try {
      await createTicketRecord({
        user_id: targetUserId,
        subject: ticketSubject.trim(),
        description: ticketBody.trim(),
        kind: 'consulta',
        priority: 'medium',
        status: 'open',
      });
      setTicketSubject('');
      setTicketBody('');
      setShowTicketForm(false);
      setFeedback('Ticket enviado a soporte correctamente.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'No se pudo enviar el ticket.');
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  const targetUserId = profile?.id ?? session?.userId;

  return (
    <Screen title="Mi perfil" subtitle={user.accountType}>
      <ListCard
        title={user.name}
        body={`${session?.email ?? user.email}\n${
          subscription ? `Plan activo hasta ${new Date(subscription.ends_at).toLocaleDateString()}` : user.accountType
        }`}
        footer={
          <Badge
            label={session ? 'Sesión autenticada' : 'Modo demostración / invitado'}
            tone={session ? 'green' : 'cream'}
          />
        }
      />

      <AppText variant="section">Datos personales</AppText>
      <FormField
        label="Nombre completo"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Tu nombre"
      />
      <FormField
        label="Teléfono de contacto"
        value={phone}
        onChangeText={setPhone}
        placeholder="+591 70000000"
        keyboardType="phone-pad"
      />
      <Button
        title={busy ? 'Guardando…' : 'Guardar cambios del perfil'}
        disabled={busy}
        onPress={() => void handleSaveProfile()}
      />

      <AppText variant="section">Intereses turísticos</AppText>
      {categories.length > 0 ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {categories.map((cat) => {
            const isSelected = interests.some(
              (item) =>
                item.category_id === cat.id &&
                (!targetUserId || item.user_id === targetUserId),
            );
            return (
              <Chip
                key={cat.id}
                label={cat.name}
                selected={isSelected}
                onPress={() => void toggleCategoryInterest(cat)}
              />
            );
          })}
        </View>
      ) : (
        <AppText variant="bodySmall">{user.interests.join(' · ')}</AppText>
      )}

      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      <Button
        title="Ver beneficios VIP"
        variant="secondary"
        onPress={() => router.navigate('/vip')}
      />
      <Button
        title={showTicketForm ? 'Ocultar formulario de soporte' : 'Contactar soporte'}
        variant="secondary"
        onPress={() => setShowTicketForm((prev) => !prev)}
      />

      {showTicketForm ? (
        <>
          <FormField
            label="Asunto del ticket"
            value={ticketSubject}
            onChangeText={setTicketSubject}
            placeholder="Ej: Consulta sobre cupón o lugar"
          />
          <FormField
            label="Descripción"
            value={ticketBody}
            onChangeText={setTicketBody}
            placeholder="Describe tu consulta"
          />
          <Button
            title="Enviar ticket a soporte"
            onPress={() => void handleCreateSupportTicket()}
          />
        </>
      ) : null}

      {session ? (
        <Button title="Cerrar sesión" variant="secondary" onPress={() => void handleLogout()} />
      ) : (
        <Button
          title="Iniciar sesión con mi cuenta"
          variant="secondary"
          onPress={() => router.navigate('/login')}
        />
      )}
    </Screen>
  );
}
