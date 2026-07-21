import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Sun,
  Monitor,
  Moon,
  Plus,
  Shield,
  CircleAlert,
  Pencil,
  Check,
  Bell,
  Camera,
  ImageUp,
  Trash2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FAMILY_PROFILE_ID,
  useAuth,
  TierGate,
  usePushSubscription,
  resolveFocusMode,
} from '@family-os/platform'
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
  Switch,
  SegmentedControl,
  ProfileAvatar,
  AvatarEditor,
  ColorPicker,
  FAMILY_HUE,
  resolveHue,
} from '@family-os/ui'
import type { PermissionToggleListItem } from '@family-os/ui'
import { CreateProfileSchema, type CreateProfileInput } from '@family-os/schemas'
import { BugReportsSection } from '@/components/BugReportsSection'

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileRow = {
  id: string
  name: string
  tier: 1 | 2 | 3 | 4
  avatarUrl?: string | null
  // The member's assigned identity colour (ADR 044) — unique across the family.
  identityHue?: string | null
  // Raw Focus-mode override: null = tier default, true/false = explicit (ADR 036).
  focusMode?: boolean | null
}
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
        <SegmentedControl
          aria-label="Role"
          options={TIER_OPTS.map(({ tier: t, label }) => ({ value: String(t), label }))}
          value={String(tier)}
          onChange={(v) => setValue('tier', Number(v) as 1 | 2 | 3 | 4)}
        />
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
  const [pendingKey, setPendingKey] = useState<string | null>(null)

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
    onSettled: () => {
      setPendingKey(null)
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteOverride = useMutation({
    mutationFn: (overrideId: string) =>
      fetch(`/api/profiles/${profileId}/permissions/${overrideId}`, { method: 'DELETE' }).then(
        (r) => {
          if (!r.ok) return r.json().then((e) => Promise.reject(e))
          return r.json()
        }
      ),
    onSettled: () => {
      setPendingKey(null)
      queryClient.invalidateQueries({ queryKey })
    },
  })

  function handleToggle(key: string) {
    if (pendingKey !== null) return
    const item = data?.permissions.find((p) => p.key === key)
    if (!item) return
    setPendingKey(key)
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

  if (isLoading) return null

  return (
    <PermissionToggleList
      items={(data?.permissions ?? []).map((p) => ({ ...p, disabled: p.key === pendingKey }))}
      onToggle={handleToggle}
    />
  )
}

// ─── Profile edit fields (autosave) ──────────────────────────────────────────

function ProfileEditFields({ profile }: { profile: ProfileRow }) {
  const queryClient = useQueryClient()
  const [name, setName] = useState(profile.name)
  const savedName = useRef(profile.name)
  const [nameStatus, setNameStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const nameTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(nameTimer.current), [])

  const saveNameMutation = useMutation({
    mutationFn: (newName: string) =>
      fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: (_, newName) => {
      savedName.current = newName
      queryClient.invalidateQueries({ queryKey: ['api/profiles'] })
      clearTimeout(nameTimer.current)
      setNameStatus('saved')
      nameTimer.current = setTimeout(() => setNameStatus('idle'), 1500)
    },
    onError: () => setNameStatus('error'),
  })

  function handleNameBlur() {
    const trimmed = name.trim()
    if (!trimmed || trimmed === savedName.current) return
    saveNameMutation.mutate(trimmed)
  }

  return (
    <div className="px-6 py-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="edit-profile-name">Name</Label>
          <Check
            size={12}
            className={cn(
              'text-[oklch(0.58_0.13_160)] transition-opacity duration-700',
              nameStatus === 'saved' ? 'opacity-100' : 'opacity-0'
            )}
          />
        </div>
        <Input
          id="edit-profile-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (nameStatus === 'error') setNameStatus('idle')
          }}
          onBlur={handleNameBlur}
          error={!name.trim() || nameStatus === 'error'}
          autoFocus
        />
        {!name.trim() && <FieldError message="Name is required" />}
        {nameStatus === 'error' && name.trim() && (
          <FieldError message="Failed to save — try again" />
        )}
      </div>
    </div>
  )
}

// ─── Profile role field (autosave, lives inside Role & Capabilities section) ──

function ProfileRoleField({ profile }: { profile: ProfileRow }) {
  const queryClient = useQueryClient()
  const [tier, setTier] = useState<1 | 2 | 3 | 4>(profile.tier)
  const savedTier = useRef(profile.tier)
  const [tierErrorMsg, setTierErrorMsg] = useState<string | null>(null)

  const saveTierMutation = useMutation({
    mutationFn: (newTier: 1 | 2 | 3 | 4) =>
      fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier }),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: (_, newTier) => {
      savedTier.current = newTier
      setTierErrorMsg(null)
      queryClient.invalidateQueries({ queryKey: ['api/profiles'] })
      queryClient.invalidateQueries({ queryKey: ['api/profiles', profile.id, 'permissions'] })
    },
    onError: (err: unknown) => {
      setTier(savedTier.current)
      setTierErrorMsg((err as { error?: string })?.error ?? 'Failed to save — try again')
    },
  })

  function handleTierChange(t: 1 | 2 | 3 | 4) {
    if (t === tier) return
    setTier(t)
    setTierErrorMsg(null)
    saveTierMutation.mutate(t)
  }

  return (
    <div className="flex flex-col gap-1.5 px-6 pb-5">
      <SegmentedControl
        aria-label="Role"
        options={TIER_OPTS.map(({ tier: t, label }) => ({ value: String(t), label }))}
        value={String(tier)}
        onChange={(v) => handleTierChange(Number(v) as 1 | 2 | 3 | 4)}
      />
      {tierErrorMsg && <FieldError message={tierErrorMsg} />}
    </div>
  )
}

// ─── Focus-mode field (autosave, lives inside Role & Capabilities section) ────

type FocusChoice = 'default' | 'focus' | 'agency'
const FOCUS_SEG_OPTIONS: { value: FocusChoice; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'focus', label: 'Focus' },
  { value: 'agency', label: 'Agency' },
]
const FOCUS_TO_OVERRIDE: Record<FocusChoice, boolean | null> = {
  default: null,
  focus: true,
  agency: false,
}
function focusToChoice(v: boolean | null): FocusChoice {
  return v === null ? 'default' : v ? 'focus' : 'agency'
}

/* Per-profile Focus-mode override (ADR 036). "Default" defers to the tier (the
   hint shows what that resolves to); Focus / Agency pin the taskee variant. */
function FocusModeField({ profile }: { profile: ProfileRow }) {
  const queryClient = useQueryClient()
  const [value, setValue] = useState<boolean | null>(profile.focusMode ?? null)
  const saved = useRef<boolean | null>(profile.focusMode ?? null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const saveMutation = useMutation({
    mutationFn: (next: boolean | null) =>
      fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusMode: next }),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: (_, next) => {
      saved.current = next
      setErrorMsg(null)
      queryClient.invalidateQueries({ queryKey: ['api/profiles'] })
      // The active profile's own view branches on /auth/me's effective value.
      queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
    },
    onError: (err: unknown) => {
      setValue(saved.current)
      setErrorMsg((err as { error?: string })?.error ?? 'Failed to save — try again')
    },
  })

  function handleChange(next: boolean | null) {
    if (next === value) return
    setValue(next)
    setErrorMsg(null)
    saveMutation.mutate(next)
  }

  const tierDefault = resolveFocusMode(null, profile.tier) ? 'Focus' : 'Agency'

  return (
    <div className="flex flex-col gap-1.5 px-6 py-5">
      <Label>Chores view</Label>
      <SegmentedControl
        aria-label="Chores view"
        options={FOCUS_SEG_OPTIONS}
        value={focusToChoice(value)}
        onChange={(v) => handleChange(FOCUS_TO_OVERRIDE[v])}
      />
      <p className="text-xs text-muted-foreground">
        {value === null
          ? `Default for this tier → ${tierDefault}`
          : value
            ? 'Focus — one task at a time'
            : 'Agency — the full task list'}
      </p>
      {errorMsg && <FieldError message={errorMsg} />}
    </div>
  )
}

// ─── Avatar (ADR 042) ─────────────────────────────────────────────────────────

/**
 * The photo affordance at the top of the profile drawer. The avatar itself is the
 * button — a camera badge says so — and the editor opens as a dialog ABOVE the
 * drawer, because cropping wants a big square canvas and the drawer is a 440px rail.
 */
function AvatarField({ profile }: { profile: ProfileRow }) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const isFamily = profile.id === FAMILY_PROFILE_ID

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ['api/profiles'] })
    // The active profile's own photo rides on /auth/me — the sidebar and mobile
    // top bar read it from there, not from the profiles list.
    queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
  }

  const uploadMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const res = await fetch(`/api/profiles/${profile.id}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': blob.type },
        body: blob,
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Upload failed')
      return res.json() as Promise<{ avatarUrl: string }>
    },
    onSuccess: () => {
      setErrorMsg(undefined)
      setEditing(false)
      refresh()
    },
    onError: (e: Error) => setErrorMsg(e.message),
  })

  const removeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/profiles/${profile.id}/avatar`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Could not remove the photo')
    },
    onSuccess: () => {
      setErrorMsg(undefined)
      refresh()
    },
    onError: (e: Error) => setErrorMsg(e.message),
  })

  const hasPhoto = Boolean(profile.avatarUrl)

  return (
    <div className="px-6 py-5">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={hasPhoto ? 'Change photo' : 'Add photo'}
          className="group relative shrink-0 cursor-pointer rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          <ProfileAvatar
            name={profile.name}
            size="lg"
            avatarUrl={profile.avatarUrl ?? undefined}
            identity={isFamily ? FAMILY_HUE : resolveHue(profile.name, profile.identityHue)}
          />
          <span className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-[var(--shadow-card)] transition-transform group-hover:scale-110">
            <Camera className="size-3.5" aria-hidden />
          </span>
        </button>

        <div className="flex min-w-0 flex-col items-start gap-1">
          <div className="flex flex-wrap items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => setEditing(true)}>
              <ImageUp className="size-4" />
              {hasPhoto ? 'Change photo' : 'Add photo'}
            </Button>
            {hasPhoto && (
              <Button
                variant="ghost-destructive"
                size="sm"
                className="h-8 px-2"
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate()}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs-body text-muted-foreground">
            {hasPhoto ? 'A photo is a face — the colour still says who.' : 'Initials for now.'}
          </p>
        </div>
      </div>

      {errorMsg && <FieldError message={errorMsg} />}

      {/* Stacked over the drawer. Radix owns the drawer's focus trap, so this plain
          overlay sits above it at a higher z-index and closes back to the drawer. */}
      {editing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Crop photo"
          className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <div className="max-h-full overflow-y-auto rounded-hero border border-border bg-card p-8 shadow-[var(--shadow-raised)]">
            <h3 className="text-card-title mb-6">
              {hasPhoto ? 'Change photo' : 'Add photo'} — {profile.name.split(' ')[0]}
            </h3>
            <AvatarEditor
              name={profile.name}
              saving={uploadMutation.isPending}
              onCancel={() => setEditing(false)}
              onSave={(blob) => uploadMutation.mutate(blob)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * The member's identity colour (ADR 044).
 *
 * It sits right beside the photo because they are the two halves of one idea: the avatar
 * carries the FACE, the chrome beside it carries the IDENTITY (ADR 042). A photo cannot
 * be a colour token, so the hue has to be chosen and shown somewhere — and this drawer,
 * reached from the member list, is the app's legend: the one surface pairing a face, a
 * name and a hue, and therefore the one place the hue→person code can be learned.
 *
 * Unlike the photo, a colour is UNIQUE across the family, which makes changing it a
 * TRADE. So a taken swatch shows who holds it rather than going quietly dead.
 */
function ColorField({
  profile,
  profiles,
  label,
}: {
  profile: ProfileRow
  profiles: ProfileRow[]
  /** Rendered as an inline heading. Omit when the surrounding SettingsSection
      already titles it, so the label isn't stated twice. */
  label?: string
}) {
  const queryClient = useQueryClient()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const takenBy: Record<string, string> = {}
  for (const p of profiles) {
    if (p.id !== FAMILY_PROFILE_ID && p.identityHue) takenBy[p.identityHue] = p.name
  }

  const mutation = useMutation({
    mutationFn: async (identityHue: string) => {
      const res = await fetch(`/api/profiles/${profile.id}/color`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identityHue }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Could not change the colour')
      return res.json()
    },
    onSuccess: () => {
      setErrorMsg(undefined)
      queryClient.invalidateQueries({ queryKey: ['api/profiles'] })
      queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
      // The hue rides on every payload carrying this person, so a change has to reach
      // the boards that paint them (ADR 044).
      queryClient.invalidateQueries({ queryKey: ['chores/tasks'] })
      queryClient.invalidateQueries({ queryKey: ['calendar/events'] })
      queryClient.invalidateQueries({ queryKey: ['calendar/activities'] })
      queryClient.invalidateQueries({ queryKey: ['family-feed/posts'] })
    },
    onError: (e: Error) => setErrorMsg(e.message),
  })

  // Hearth is reserved and never assignable — the household is a who, not a member
  // (ADR 041). Bailing out AFTER the hooks, never before them.
  if (profile.id === FAMILY_PROFILE_ID) return null

  return (
    <div className="flex flex-col gap-3 px-6 py-5">
      <div className="flex flex-col gap-1">
        {label && <h3 className="text-section-label text-muted-foreground">{label}</h3>}
        <p className="text-xs-body text-muted-foreground">
          {profile.name.split(' ')[0]}’s colour, everywhere they appear. No two people share one.
        </p>
      </div>
      <ColorPicker
        value={profile.identityHue}
        takenBy={takenBy}
        disabled={mutation.isPending}
        onChange={(hue) => mutation.mutate(hue)}
      />
      {errorMsg && <FieldError message={errorMsg} />}
    </div>
  )
}

// ─── Profile edit drawer ──────────────────────────────────────────────────────

function ProfileEditDrawer({
  profile,
  profiles,
  onClose,
}: {
  profile: ProfileRow | null
  profiles: ProfileRow[]
  onClose: () => void
}) {
  const { id: activeProfileId } = useAuth()
  const isOwnProfile = profile?.id === activeProfileId

  return (
    <Drawer open={!!profile} onClose={onClose} title={profile?.name ?? ''}>
      {profile && (
        <>
          <AvatarField profile={profile} />
          <div className="border-t border-border" />
          <ColorField profile={profile} profiles={profiles} label="Colour" />
          <div className="border-t border-border" />
          <ProfileEditFields profile={profile} />

          <div className="border-t-2 border-border">
            <div className="px-6 pt-5 pb-3">
              <h3 className="text-section-label text-muted-foreground">Role & Capabilities</h3>
            </div>
            <ProfileRoleField profile={profile} />
            <div className="border-t border-border">
              <FocusModeField profile={profile} />
            </div>
            {!isOwnProfile && (
              <div className="border-t border-border">
                <CapabilitiesPanel profileId={profile.id} />
              </div>
            )}
          </div>
        </>
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

  const nonFamily = profiles.filter((p) => p.id !== FAMILY_PROFILE_ID)

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
            hue={profile.identityHue}
            avatarUrl={profile.avatarUrl}
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

      <ProfileEditDrawer
        profile={editTarget}
        profiles={profiles}
        onClose={() => setEditTarget(null)}
      />

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
  const isFamily = profileId === FAMILY_PROFILE_ID || !profileId
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

// ─── Push notifications row ───────────────────────────────────────────────────

function PushNotificationsRow() {
  const queryClient = useQueryClient()
  const { state, isLoading, subscribe, unsubscribe } = usePushSubscription()

  const enabled = state === 'subscribed'

  async function handleToggle() {
    if (isLoading) return
    if (enabled) {
      await unsubscribe()
    } else {
      await subscribe()
    }
    queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
  }

  const subtitle =
    state === 'unsupported'
      ? 'Not supported in this browser'
      : state === 'denied'
        ? 'Notifications blocked — check browser settings'
        : 'Receive alerts on this device when away'

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Bell size={16} className="text-primary" />
      </div>
      <div className="flex-1">
        <Label htmlFor="push-notifications-toggle" className="text-sm font-medium cursor-pointer">
          Push Notifications
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <Switch
        id="push-notifications-toggle"
        checked={enabled}
        onCheckedChange={handleToggle}
        disabled={isLoading || state === 'unsupported' || state === 'denied' || state === 'unknown'}
      />
    </div>
  )
}

// ─── Your photo + colour (self-serve — every tier) ────────────────────────────

/**
 * The self-serve half of ADR 042 and ADR 044. The Profiles section is tier-4 only, so
 * without this a kid would have the *permission* to change their own photo and their own
 * colour, and nowhere to do it. Choosing your own face and your own colour are personal
 * settings, so they sit beside Display rather than inside profile administration.
 *
 * The colour needs the whole roster, not just this profile: a hue is UNIQUE across the
 * family, so the picker has to show which are taken, and by whom.
 */
function YourAppearanceSection() {
  const { id, name, tier, avatarUrl, identityHue } = useAuth()

  const { data: profiles = [] } = useQuery<ProfileRow[]>({
    queryKey: ['api/profiles'],
    queryFn: () => fetch('/api/profiles').then((r) => r.json()) as Promise<ProfileRow[]>,
    staleTime: 30_000,
  })

  // The household has no "own" photo or colour to set — a family session is tier 1, its
  // photo is a tier-4 decision (ADR 042), and Hearth is reserved (ADR 041).
  if (id === FAMILY_PROFILE_ID) return null

  // `identityHue` MUST be threaded through here. Rebuilding the profile as a literal and
  // forgetting it is precisely how this avatar ended up hashing its owner's name while
  // the spine two inches away painted their real colour.
  const self: ProfileRow = { id, name, tier, avatarUrl, identityHue }

  return (
    <>
      <SettingsSection title="Your photo">
        <AvatarField profile={self} />
      </SettingsSection>
      <SettingsSection title="Your colour">
        <ColorField profile={self} profiles={profiles} />
      </SettingsSection>
    </>
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

        <SettingsSection title="Reported problems">
          <BugReportsSection />
        </SettingsSection>
      </TierGate>

      <YourAppearanceSection />

      <SettingsSection title="Display">
        <AppearanceRow />
      </SettingsSection>

      <TierGate min={3}>
        <SettingsSection title="Notifications">
          <PushNotificationsRow />
        </SettingsSection>
      </TierGate>
    </SettingsLayout>
  )
}
