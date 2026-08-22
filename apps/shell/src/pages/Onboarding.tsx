import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, Plus, Trash2, Check, CircleAlert } from 'lucide-react'
import {
  Button,
  Input,
  Label,
  Badge,
  ProfileAvatar,
  ColorPicker,
  Spine,
  identityToken,
  nextFreeHue,
  cn,
  type IdentityHue,
} from '@family-os/ui'
import { FamilySetupSchema, type FamilySetupInput } from '@family-os/schemas'

type SetupStatus = { needsSetup: boolean; currentStep: 1 | 2 | 3 | null }
type TierLevel = 1 | 2 | 3 | 4
type Step = 1 | 2 | 3

interface Member {
  id: string
  name: string
  tier: TierLevel
  /** Auto-assigned on add, shown immediately, changeable by tapping the dot (ADR 044).
      Nobody is ever BLOCKED on choosing a colour — setting up the house is the job. */
  hue: IdentityHue
}

type ProfileRow = { id: string; identityHue?: string | null }

const TIER_OPTS: { tier: TierLevel; label: string }[] = [
  { tier: 4, label: 'Parent' },
  { tier: 3, label: 'Teen' },
  { tier: 2, label: 'Older kid' },
  { tier: 1, label: 'Little one' },
]

// ─── Shared ───────────────────────────────────────────────────────────────────

function StepDots({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      {([1, 2, 3] as Step[]).map((s) => (
        <div
          key={s}
          className={cn(
            'rounded-full transition-all duration-[var(--duration-normal)]',
            s < current
              ? 'w-2 h-2 bg-primary'
              : s === current
                ? 'w-3 h-3 bg-primary'
                : 'w-2 h-2 bg-border'
          )}
        />
      ))}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <CircleAlert size={12} className="shrink-0" />
      {message}
    </p>
  )
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────

function Step1({ onComplete }: { onComplete: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FamilySetupInput>({ resolver: zodResolver(FamilySetupSchema) })

  const mutation = useMutation({
    mutationFn: (data: FamilySetupInput) =>
      fetch('/api/setup/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: onComplete,
  })

  return (
    <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="familyName">Family name</Label>
        <Input
          id="familyName"
          {...register('familyName')}
          placeholder="e.g. The Johnson Family"
          error={!!errors.familyName}
          autoFocus
        />
        <FieldError message={errors.familyName?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="parentName">Your name</Label>
        <Input
          id="parentName"
          {...register('parentName')}
          placeholder="e.g. Alex Johnson"
          error={!!errors.parentName}
        />
        <FieldError message={errors.parentName?.message} />
        <p className="text-xs text-muted-foreground">You'll be the family administrator.</p>
      </div>

      {mutation.isError && (
        <p className="text-xs text-destructive">Something went wrong — please try again.</p>
      )}

      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          Continue
          <ChevronRight size={16} />
        </Button>
      </div>
    </form>
  )
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────

function Step2({ onComplete }: { onComplete: () => void }) {
  const [members, setMembers] = useState<Member[]>([])
  const [draftName, setDraftName] = useState('')
  const [draftTier, setDraftTier] = useState<TierLevel>(4)
  const [draftError, setDraftError] = useState('')
  const [recolouring, setRecolouring] = useState<string | null>(null)

  // Step 1 already created the first parent, and the server gave them a colour. We need
  // to know which, or we would hand a second member the same one.
  const { data: existing = [] } = useQuery<ProfileRow[]>({
    queryKey: ['api/profiles'],
    queryFn: () => fetch('/api/profiles').then((r) => r.json()) as Promise<ProfileRow[]>,
    staleTime: 30_000,
  })

  const claimedHues = [
    ...existing.map((p) => p.identityHue).filter((h): h is string => Boolean(h)),
    ...members.map((m) => m.hue),
  ]
  const paletteFull = nextFreeHue(claimedHues) === null

  const mutation = useMutation({
    mutationFn: (profiles: Array<{ name: string; tier: number; identityHue: string }>) =>
      fetch('/api/setup/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles }),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: onComplete,
  })

  const addMember = () => {
    if (!draftName.trim()) {
      setDraftError('Name is required')
      return
    }
    // The palette is a hard cap on household size (ADR 044). Say so; never silently
    // hand out a duplicate — a shared hue points "colour = person" at two people.
    const hue = nextFreeHue(claimedHues)
    if (!hue) {
      setDraftError('Every colour is taken — a family can have at most 8 members.')
      return
    }
    setDraftError('')
    setMembers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: draftName.trim(), tier: draftTier, hue },
    ])
    setDraftName('')
    setDraftTier(4)
  }

  const submit = () =>
    mutation.mutate(members.map(({ name, tier, hue }) => ({ name, tier, identityHue: hue })))

  const tierLabel = (tier: TierLevel) => TIER_OPTS.find((o) => o.tier === tier)?.label ?? ''

  // Who holds what, for the picker's "taken" state. Keyed by hue.
  const takenBy = Object.fromEntries(members.map((m) => [m.hue, m.name]))

  return (
    <div className="flex flex-col gap-5">
      {members.length > 0 && (
        <ul className="flex flex-col gap-2">
          {members.map((m) => (
            <li key={m.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-background border border-border">
                <div className="flex min-w-0 items-center gap-3">
                  {/* The colour is assigned, and SHOWN. Never hidden behind a step the
                      parent has to complete before they can get on with it (ADR 044). */}
                  <Spine color={identityToken(m.hue)} className="h-8" />
                  <ProfileAvatar name={m.name} size="sm" identity={m.hue} />
                  <span className="truncate text-sm font-medium">{m.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="muted">{tierLabel(m.tier)}</Badge>
                  <button
                    type="button"
                    onClick={() => setRecolouring((cur) => (cur === m.id ? null : m.id))}
                    aria-label={`Change ${m.name}'s colour — currently ${m.hue}`}
                    aria-expanded={recolouring === m.id}
                    className={cn(
                      'size-5 shrink-0 rounded-full cursor-pointer',
                      'transition-transform duration-[var(--duration-fast)] hover:scale-110',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                      recolouring === m.id && 'ring-2 ring-foreground ring-offset-2'
                    )}
                    style={{ background: identityToken(m.hue) }}
                  />
                  <Button
                    type="button"
                    variant="ghost-destructive"
                    size="icon"
                    onClick={() => {
                      setMembers((ms) => ms.filter((x) => x.id !== m.id))
                      setRecolouring((cur) => (cur === m.id ? null : cur))
                    }}
                    aria-label={`Remove ${m.name}`}
                    className="h-7 w-7"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              {recolouring === m.id && (
                <div className="rounded-lg border border-border bg-background p-3">
                  <ColorPicker
                    value={m.hue}
                    takenBy={takenBy}
                    onChange={(hue) => {
                      setMembers((ms) => ms.map((x) => (x.id === m.id ? { ...x, hue } : x)))
                      setRecolouring(null)
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-3 p-4 rounded-xl border border-dashed border-border">
        <div className="flex flex-col gap-2">
          <Label htmlFor="memberName">Name</Label>
          <Input
            id="memberName"
            value={draftName}
            onChange={(e) => {
              setDraftName(e.target.value)
              setDraftError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addMember()
              }
            }}
            placeholder="Family member's name"
            error={!!draftError}
          />
          <FieldError message={draftError} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Role</Label>
          <div className="flex gap-2">
            {TIER_OPTS.map(({ tier, label }) => (
              <button
                key={tier}
                type="button"
                onClick={() => setDraftTier(tier)}
                className={cn(
                  'flex-1 py-2 rounded-lg border text-xs font-medium transition-colors',
                  draftTier === tier
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMember}
          disabled={paletteFull}
          className="w-full"
        >
          <Plus size={14} />
          Add
        </Button>

        {paletteFull && (
          <p className="text-xs text-muted-foreground">
            Every colour is taken — a family can have at most 8 members.
          </p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-xs text-destructive">Something went wrong — please try again.</p>
      )}

      <div className="flex items-center justify-between pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={submit}
          disabled={mutation.isPending}
        >
          Skip
        </Button>
        <Button type="button" onClick={submit} disabled={mutation.isPending}>
          Continue
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<'enter' | 'confirm' | 'done' | 'mismatch'>('enter')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [firstPin, setFirstPin] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation({
    mutationFn: (pinValue: string) =>
      fetch('/api/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinValue }),
      }).then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e))
        return r.json()
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['api/setup/status'] })
      await queryClient.invalidateQueries({ queryKey: ['api/auth/me'] })
      navigate('/', { replace: true })
    },
  })

  const current = phase === 'confirm' ? confirmPin : pin

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)

    if (phase === 'confirm') {
      setConfirmPin(val)
      if (val.length === 4) {
        setTimeout(() => {
          if (val === firstPin) {
            setPhase('done')
          } else {
            setConfirmPin('')
            setPhase('mismatch')
            setTimeout(() => setPhase('confirm'), 900)
          }
        }, 200)
      }
    } else {
      setPin(val)
      if (val.length === 4) {
        setTimeout(() => {
          setFirstPin(val)
          setPin('')
          setPhase('confirm')
        }, 200)
      }
    }
  }

  const isDone = phase === 'done'
  const isMismatch = phase === 'mismatch'

  return (
    <div className="flex flex-col items-center gap-7 py-2">
      <div className="text-center">
        <p className="text-sm font-medium">
          {isDone
            ? 'PIN confirmed'
            : isMismatch
              ? "PINs don't match"
              : phase === 'confirm'
                ? 'Confirm your PIN'
                : 'Choose a 4-digit PIN'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {isDone
            ? 'Tap Finish to complete setup.'
            : isMismatch
              ? 'Try again'
              : phase === 'confirm'
                ? 'Type the same PIN again'
                : 'Used for switching profiles'}
        </p>
      </div>

      {/* Hidden keyboard input backing the dot-box widget */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        value={current}
        onChange={handleChange}
        className="sr-only"
        aria-label="PIN entry"
        autoFocus
      />

      {isDone ? (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'oklch(0.44 0.10 148 / 0.15)' }}
        >
          <Check size={24} className="text-success" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          className="flex gap-3 focus:outline-none"
          aria-label="PIN digit boxes — click to focus"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all duration-150',
                isMismatch
                  ? 'border-destructive'
                  : i < current.length
                    ? 'border-primary'
                    : 'border-border bg-background'
              )}
              style={
                !isMismatch && i < current.length
                  ? { background: 'color-mix(in oklab, var(--primary) 8%, transparent)' }
                  : {}
              }
            >
              {i < current.length && (
                <div
                  className={cn(
                    'w-3 h-3 rounded-full',
                    isMismatch ? 'bg-destructive' : 'bg-primary'
                  )}
                />
              )}
            </div>
          ))}
        </button>
      )}

      <p className="text-xs text-muted-foreground h-4">
        {!isDone && !isMismatch && (phase === 'enter' ? 'Step 1 of 2' : 'Step 2 of 2')}
      </p>

      {isDone && (
        <Button
          type="button"
          onClick={() => mutation.mutate(firstPin)}
          disabled={mutation.isPending}
          className="w-full"
        >
          {mutation.isPending ? 'Finishing…' : 'Finish setup'}
        </Button>
      )}

      {mutation.isError && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <CircleAlert size={12} />
          Something went wrong — please try again.
        </p>
      )}
    </div>
  )
}

// ─── Card shell ───────────────────────────────────────────────────────────────

const STEP_META: Record<Step, { title: string; sub: string }> = {
  1: { title: 'Set up your family', sub: 'Choose a name and create your admin profile.' },
  2: { title: 'Add family members', sub: 'Add parents, teens, or kids — or skip for now.' },
  3: { title: 'Protect with a PIN', sub: 'One PIN gates profile switching for everyone.' },
}

function OnboardingFlow({ initialStep }: { initialStep: Step }) {
  const [step, setStep] = useState<Step>(initialStep)
  const queryClient = useQueryClient()

  const advance = () => {
    queryClient.invalidateQueries({ queryKey: ['api/setup/status'] })
    setStep((s) => (s < 3 ? ((s + 1) as Step) : s))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase font-semibold mb-6">
        Vireo
      </p>

      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-[var(--shadow-raised)] overflow-hidden">
        <div className="px-8 pt-8 pb-6 border-b border-border flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1.5">
              Step {step} of 3
            </p>
            <h2 className="text-heading">{STEP_META[step].title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{STEP_META[step].sub}</p>
          </div>
          <StepDots current={step} />
        </div>

        <div className="px-8 py-7">
          {step === 1 && <Step1 onComplete={advance} />}
          {step === 2 && <Step2 onComplete={advance} />}
          {step === 3 && <Step3 />}
        </div>
      </div>
    </div>
  )
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export function Onboarding() {
  const { data, isPending } = useQuery<SetupStatus>({
    queryKey: ['api/setup/status'],
    queryFn: () => fetch('/api/setup/status').then((r) => r.json()),
    staleTime: 0,
  })

  if (isPending) return null
  if (!data?.needsSetup) return <Navigate to="/" replace />

  return <OnboardingFlow initialStep={data.currentStep ?? 1} />
}
