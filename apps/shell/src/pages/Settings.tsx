import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Sun, Monitor, Moon, Plus, Shield, CircleAlert, Pencil } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth, TierGate } from '@family-os/platform'
import {
  Button,
  Input,
  Label,
  cn,
  SettingsLayout,
  SettingsSection,
  ProfileListItem,
  ConfirmDialog,
  PinInput,
  PermissionToggleList,
  Drawer,
} from '@family-os/ui'
import type { PermissionToggleListItem } from '@family-os/ui'
import {
  CreateProfileSchema,
  type CreateProfileInput,
  type UpdateProfileInput,
} from '@family-os/schemas'

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileRow = { id: string; name: string; tier: 1 | 2 | 3 | 4 }
type DarkModeValue = boolean | null
type PinResetPhase = 'idle' | 'current' | 'current-error' | 'new' | 'confirm' | 'mismatch'

type PermissionRow = PermissionToggleListItem & {
  action: string
  subject: string
  overrideId: string | null
}

const FamilyNameSchema = z.object({ name: z.string().min(1, 'Name is required').max(50) })
type FamilyNameInput = z.infer<typeof FamilyNameSchema>

const TIER_OPTS = [
  { tier: 4 as const, label: 'Parent' },
  { tier: 3 as const, label: 'Teen' },
  { tier: 2 as const, label: 'Older kid' },
  { tier: 1 as const, label: 'Little one' },
]

const APPEARANCE_OPTIONS: { value: DarkModeValue; label: string; Icon: LucideIcon }[] = [
  { value: false, label: 'Light', Icon: Sun },
  { value: null, label: 'System', Icon: Monitor },
  { value: true, label: 'Dark', Icon: Moon },
]

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <CircleAlert size={12} className="shrink-0" />
      {message}
    </p>
  )
}

// ─── Profile form (create / edit) ────────────────────────────────────────────

function ProfileForm({
  initial,
  onSave,
  onCancel,
  isPending,
  className,
}: {
  initial?: ProfileRow
  onSave: (data: CreateProfileInput) => void
  onCancel: () => void
  isPending: boolean
  className?: string
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProfileInput>({
    resolver: zodResolver(CreateProfileSchema),
    defaultValues: initial ?? { name: '', tier: 4 },
  })
  const tier = watch('tier')

  return (
    <form
      onSubmit={handleSubmit(onSave)}
      className={cn('flex flex-col gap-4 px-6 py-5', className)}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          {...register('name')}
          placeholder="Family member's name"
          error={!!errors.name}
          autoFocus
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Role</Label>
        <div className="flex gap-2">
          {TIER_OPTS.map(({ tier: t, label }) => (
            <button
              key={t}
              type="button"
              onClick={() => setValue('tier', t)}
              className={cn(
                'flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors',
                tier === t
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {initial ? 'Save changes' : 'Add profile'}
        </Button>
      </div>
    </form>
  )
}

// ─── Capabilities panel ───────────────────────────────────────────────────────

function CapabilitiesPanel({ profileId }: { profileId: string }) {
  const queryClient = useQueryClient()
  const queryKey = ['api/profiles', profileId, 'permissions']

  const { data, isLoading } = useQuery<{ permissions: PermissionRow[] }>({
    queryKey,
    queryFn: () =>
      fetch(`/api/profiles/${profileId}/permissions`).then((r) => r.json()) as Promise<{
        permissions: PermissionRow[]
      }>,
  })

  const createOverride = useMutation({
    mutationFn: (body: { action: string; subject: string; type: 'grant' | 'revocation' }) =>
      fetch(`/api/profiles/${profileId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  const deleteOverride = useMutation({
    mutationFn: (overrideId: string) =>
      fetch(`/api/profiles/${profileId}/permissions/${overrideId}`, { method: 'DELETE' }).then(
        (r) => {
          if (!r.ok) return r.json().then((e) => Promise.reject(e))
          return r.json()
        }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  })

  function handleToggle(key: string) {
    const item = data?.permissions.find((p) => p.key === key)
    if (!item) return
    if (item.overrideId !== null) {
      deleteOverride.mutate(item.overrideId)
    } else {
      createOverride.mutate({
        action: item.action,
        subject: item.subject,
        type: item.inBaseline ? 'revocation' : 'grant',
      })
    }
  }

  const isPending = createOverride.isPending || deleteOverride.isPending

  if (isLoading) return null

  return (
    <PermissionToggleList
      items={(data?.permissions ?? []).map((p) => ({ ...p, disabled: isPending }))}
      onToggle={handleToggle}
    />
  )
}

// ─── Profile edit drawer ──────────────────────────────────────────────────────

function ProfileEditDrawer({
  profile,
  onClose,
}: {
  profile: ProfileRow | null
  onClose: () => void
}) {
  const { id: activeProfileId } = useAuth()
  const queryClient = useQueryClient()

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfileInput }) =>
      fetch(`/api/profiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api/profiles'] })
      onClose()
    },
  })

  const isOwnProfile = profile?.id === activeProfileId

  return (
    <Drawer open={!!profile} onClose={onClose} title={profile?.name ?? ''}>
      {profile && (
        <div className="divide-y divide-border">
          <ProfileForm
            initial={profile}
            onSave={(data) => editMutation.mutate({ id: profile.id, data })}
            onCancel={onClose}
            isPending={editMutation.isPending}
          />

          {!isOwnProfile && (
            <div>
              <div className="px-6 py-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  Capabilities
                </h3>
              </div>
              <CapabilitiesPanel profileId={profile.id} />
            </div>
          )}
        </div>
      )}
    </Drawer>
  )
}

// ─── Profiles section ─────────────────────────────────────────────────────────

function ProfilesSection() {
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<ProfileRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProfileRow | null>(null)

  const { data: profiles = [] } = useQuery<ProfileRow[]>({
    queryKey: ['api/profiles'],
    queryFn: () => fetch('/api/profiles').then((r) => r.json()) as Promise<ProfileRow[]>,
    staleTime: 30_000,
  })

  const nonFamily = profiles.filter((p) => p.id !== 'family')

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['api/profiles'] })

  const createMutation = useMutation({
    mutationFn: (data: CreateProfileInput) =>
      fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: () => {
      invalidate()
      setShowCreate(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/profiles/${id}`, { method: 'DELETE' }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: () => {
      invalidate()
      setDeleteTarget(null)
    },
  })

  return (
    <>
      <SettingsSection
        title="Profiles"
        action={
          !showCreate ? (
            <Button size="sm" variant="outline" onClick={() => setShowCreate(true)}>
              <Plus className="size-3.5" /> Add
            </Button>
          ) : undefined
        }
      >
        {nonFamily.map((profile, i) => (
          <ProfileListItem
            key={profile.id}
            name={profile.name}
            tier={profile.tier}
            isLast={i === nonFamily.length - 1 && !showCreate}
            onEdit={() => setEditTarget(profile)}
            onRemove={() => setDeleteTarget(profile)}
          />
        ))}

        {nonFamily.length === 0 && !showCreate && (
          <p className="px-6 py-5 text-sm text-muted-foreground">No profiles yet.</p>
        )}

        {showCreate && (
          <ProfileForm
            onSave={(data) => createMutation.mutate(data)}
            onCancel={() => setShowCreate(false)}
            isPending={createMutation.isPending}
            className="border-t border-border bg-secondary/40"
          />
        )}
      </SettingsSection>

      <ProfileEditDrawer profile={editTarget} onClose={() => setEditTarget(null)} />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Remove ${deleteTarget?.name.split(' ')[0]}?`}
        description="Their home screen, preferences, and all module data including chores and schedules will be permanently deleted."
        confirmLabel="Remove"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
        isPending={deleteMutation.isPending}
      />
    </>
  )
}

// ─── Family name section ──────────────────────────────────────────────────────

function FamilySection() {
  const { familyName } = useAuth()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FamilyNameInput>({
    resolver: zodResolver(FamilyNameSchema),
    defaultValues: { name: familyName ?? '' },
  })

  const updateMutation = useMutation({
    mutationFn: ({ name }: FamilyNameInput) =>
      fetch('/api/settings/family-name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
      setEditing(false)
    },
  })

  if (!editing) {
    return (
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-medium">Family name</p>
          <p className="text-xs text-muted-foreground mt-0.5">{familyName ?? '—'}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            reset({ name: familyName ?? '' })
            setEditing(true)
          }}
          className="gap-1.5"
        >
          <Pencil className="size-3.5" /> Edit
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
      className="flex flex-col gap-3 px-6 py-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="family-name">Family name</Label>
        <Input
          id="family-name"
          {...register('name')}
          placeholder="The Smiths"
          error={!!errors.name}
          autoFocus
        />
        {errors.name && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <CircleAlert size={12} className="shrink-0" />
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setEditing(false)}
          disabled={updateMutation.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={updateMutation.isPending}>
          Save
        </Button>
      </div>
    </form>
  )
}

// ─── PIN reset section ────────────────────────────────────────────────────────

function PinResetRow() {
  const [phase, setPhase] = useState<PinResetPhase>('idle')
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [savedFirst, setSavedFirst] = useState('')

  const queryClient = useQueryClient()

  const pinExistsQuery = useQuery({
    queryKey: ['api/auth/pin-exists'],
    queryFn: () =>
      fetch('/api/auth/pin-exists').then((r) => r.json()) as Promise<{ exists: boolean }>,
    staleTime: Infinity,
    enabled: false,
  })

  const checkPinMutation = useMutation({
    mutationFn: (pin: string) =>
      fetch('/api/auth/pin/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: () => setPhase('new'),
    onError: () => {
      setPhase('current-error')
      setCurrentPin('')
      setTimeout(() => setPhase('current'), 900)
    },
  })

  const resetMutation = useMutation({
    mutationFn: (body: { currentPin?: string; newPin: string }) =>
      fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: () => {
      cancelReset()
      queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
    },
  })

  function cancelReset() {
    setPhase('idle')
    setCurrentPin('')
    setNewPin('')
    setConfirmPin('')
    setSavedFirst('')
  }

  async function handleStartReset() {
    const { data } = await pinExistsQuery.refetch()
    setPhase(data?.exists ? 'current' : 'new')
  }

  function handleCurrentPin(val: string) {
    setCurrentPin(val)
    if (val.length === 4) setTimeout(() => checkPinMutation.mutate(val), 200)
  }

  function handleNewPin(val: string) {
    setNewPin(val)
    if (val.length === 4)
      setTimeout(() => {
        setSavedFirst(val)
        setNewPin('')
        setPhase('confirm')
      }, 200)
  }

  function handleConfirmPin(val: string) {
    setConfirmPin(val)
    if (val.length === 4) {
      setTimeout(() => {
        if (val === savedFirst) {
          resetMutation.mutate({ currentPin: currentPin || undefined, newPin: savedFirst })
        } else {
          setPhase('mismatch')
          setConfirmPin('')
          setTimeout(() => setPhase('confirm'), 900)
        }
      }, 200)
    }
  }

  const PHASE_LABEL: Record<PinResetPhase, string> = {
    idle: '',
    current: 'Enter current PIN',
    'current-error': 'Incorrect PIN',
    new: 'Choose a new PIN',
    confirm: 'Confirm new PIN',
    mismatch: "PINs don't match — try again",
  }

  if (phase === 'idle') {
    return (
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Shield size={16} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Family PIN</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Required to switch to parent profiles
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartReset}
          disabled={pinExistsQuery.isFetching}
        >
          Reset
        </Button>
      </div>
    )
  }

  const isErrorPhase = phase === 'current-error' || phase === 'mismatch'

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-6">
      <p className={cn('text-sm font-medium', isErrorPhase && 'text-destructive')}>
        {PHASE_LABEL[phase]}
      </p>

      <PinInput
        value={
          phase === 'current' || phase === 'current-error'
            ? currentPin
            : phase === 'confirm' || phase === 'mismatch'
              ? confirmPin
              : newPin
        }
        onChange={
          phase === 'current' || phase === 'current-error'
            ? handleCurrentPin
            : phase === 'confirm' || phase === 'mismatch'
              ? handleConfirmPin
              : handleNewPin
        }
        error={isErrorPhase}
        autoFocus
      />

      <button
        onClick={cancelReset}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}

// ─── Appearance section ───────────────────────────────────────────────────────

function AppearanceRow() {
  const { id: profileId, darkMode } = useAuth()
  const queryClient = useQueryClient()
  const isFamily = profileId === 'family' || !profileId
  const activeValue: DarkModeValue = darkMode === undefined ? null : (darkMode ?? null)

  const { mutate } = useMutation({
    mutationFn: async (value: DarkModeValue) => {
      const res = await fetch('/api/preferences/dark-mode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ darkMode: value }),
      })
      if (!res.ok) throw new Error('Failed to update preference')
    },
    onMutate: async (value) => {
      await queryClient.cancelQueries({ queryKey: ['api/auth/me'] })
      const prev = queryClient.getQueryData(['api/auth/me'])
      queryClient.setQueryData(['api/auth/me'], (old: Record<string, unknown> | undefined) =>
        old ? { ...old, darkMode: value } : old
      )
      return { prev }
    },
    onError: (_err, _val, context) => {
      if (context?.prev) queryClient.setQueryData(['api/auth/me'], context.prev)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['api/auth/me'] }),
  })

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="text-sm font-medium">Appearance</p>
        {isFamily && (
          <p className="text-xs text-muted-foreground mt-0.5">
            The family profile follows the system setting
          </p>
        )}
      </div>

      <div
        className={cn(
          'flex rounded-lg bg-muted p-1 gap-0.5',
          isFamily && 'pointer-events-none opacity-50'
        )}
      >
        {APPEARANCE_OPTIONS.map(({ value, label, Icon }) => {
          const isActive = activeValue === value
          return (
            <Button
              key={String(value)}
              variant="ghost"
              size="sm"
              onClick={() => mutate(value)}
              disabled={isFamily}
              aria-pressed={isActive}
              className={cn(
                'gap-1.5',
                isActive &&
                  'bg-background text-foreground shadow-sm hover:bg-background hover:text-foreground'
              )}
            >
              <Icon className="size-3.5" aria-hidden />
              {label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Settings() {
  return (
    <SettingsLayout>
      <TierGate min={4}>
        <SettingsSection title="Family">
          <FamilySection />
        </SettingsSection>

        <ProfilesSection />

        <SettingsSection title="Security">
          <PinResetRow />
        </SettingsSection>
      </TierGate>

      <SettingsSection title="Display">
        <AppearanceRow />
      </SettingsSection>
    </SettingsLayout>
  )
}
