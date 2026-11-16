import { useCallback, useEffect, useState } from 'react';

import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { ListCard } from '@/components/ui/list-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import {
  listProfiles,
  listUserAccess,
  updateUserAccess,
} from '@/services/usuarios.service';
import type { DbProfile, DbUserAccess } from '@/types/database';

const roleOptions = ['tourist', 'vip', 'business', 'support', 'admin'] as const;

/** Pantalla 49 del prototipo: Gestión de usuarios y permisos (/api/v1/profiles y /user-access). */
export default function AdminUsuariosScreen() {
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [accessList, setAccessList] = useState<DbUserAccess[]>([]);
  const [search, setSearch] = useState('');
  const [selectedAccess, setSelectedAccess] = useState<DbUserAccess | null>(null);
  const [roleChoice, setRoleChoice] = useState<(typeof roleOptions)[number]>('tourist');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pData, aData] = await Promise.all([
        listProfiles({ limit: 50 }).catch(() => [] as DbProfile[]),
        listUserAccess(undefined, { limit: 50 }).catch(() => [] as DbUserAccess[]),
      ]);
      setProfiles(pData);
      setAccessList(aData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSaveRole(access: DbUserAccess) {
    setBusy(true);
    setFeedback('');
    try {
      const updated = await updateUserAccess(access.id, { role: roleChoice });
      setAccessList((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      setSelectedAccess(null);
      setFeedback('Rol de usuario actualizado en user_access.');
    } catch (err) {
      setFeedback(
        err instanceof Error ? err.message : 'No se pudo actualizar el rol.',
      );
    } finally {
      setBusy(false);
    }
  }

  const accessByUser = new Map(accessList.map((a) => [a.user_id, a]));
  const filtered = profiles.filter((p) =>
    p.full_name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <Screen title="Usuarios y permisos" subtitle={`${profiles.length} perfiles en Supabase`}>
      <FormField
        label="Buscar por nombre"
        placeholder="Ana, Carlos, María…"
        value={search}
        onChangeText={setSearch}
      />
      {loading ? <AppText variant="caption">Cargando perfiles y accesos…</AppText> : null}
      {feedback ? (
        <AppText variant="bodySmall" accessibilityLiveRegion="polite">
          {feedback}
        </AppText>
      ) : null}

      {selectedAccess ? (
        <ListCard
          title="Cambiar rol del usuario seleccionado"
          body={`ID de acceso: ${selectedAccess.id.slice(0, 8)}`}
          footer={
            <>
              <SegmentedControl
                label="Nuevo rol"
                options={roleOptions}
                value={roleChoice}
                onChange={setRoleChoice}
              />
              <Button
                title={busy ? 'Guardando…' : 'Confirmar cambio de rol'}
                size="sm"
                disabled={busy}
                onPress={() => void handleSaveRole(selectedAccess)}
              />
              <Button
                title="Cancelar"
                variant="secondary"
                size="sm"
                onPress={() => setSelectedAccess(null)}
              />
            </>
          }
        />
      ) : null}

      {filtered.map((profile) => {
        const access = accessByUser.get(profile.id);
        return (
          <ListCard
            key={profile.id}
            title={profile.full_name}
            body={`Teléfono: ${profile.phone ?? 'No registrado'}\nEstado: ${access?.status ?? 'active'}`}
            footer={
              <>
                <Badge
                  label={`Rol: ${access?.role ?? 'tourist'}`}
                  tone={access?.role === 'admin' ? 'cream' : 'green'}
                />
                {access ? (
                  <Button
                    align="left"
                    size="sm"
                    variant="secondary"
                    title="Editar rol"
                    onPress={() => {
                      setSelectedAccess(access);
                      const matched = roleOptions.find((r) => r === access.role) ?? 'tourist';
                      setRoleChoice(matched);
                    }}
                  />
                ) : null}
              </>
            }
          />
        );
      })}
    </Screen>
  );
}
