import { useCallback, useEffect, useState } from 'react'

/* Board preferences that belong to a device, not to an account — the fridge iPad
   and a parent's laptop want different answers, so these never go to the server.
   Keyed by profile so a switch on a shared device doesn't inherit the last
   person's view. */
const HIDE_COMPLETED = 'chores.hide-completed'

/** `null` profileId = no persistence (the view also renders bare in Storybook). */
export function useHideCompleted(profileId: string | null): [boolean, (next: boolean) => void] {
  const key = profileId ? `${HIDE_COMPLETED}:${profileId}` : null
  const [value, setValue] = useState(() => read(key))

  // A profile switch changes the key without remounting the view.
  useEffect(() => setValue(read(key)), [key])

  const update = useCallback(
    (next: boolean) => {
      setValue(next)
      write(key, next)
    },
    [key]
  )

  return [value, update]
}

function read(key: string | null): boolean {
  if (!key) return false
  try {
    return localStorage.getItem(key) === 'true'
  } catch (err) {
    // Private-mode Safari throws on access. Falling back is fine; going silent is not.
    console.error('chores: could not read device pref', key, err)
    return false
  }
}

function write(key: string | null, value: boolean) {
  if (!key) return
  try {
    localStorage.setItem(key, String(value))
  } catch (err) {
    console.error('chores: could not save device pref', key, err)
  }
}
