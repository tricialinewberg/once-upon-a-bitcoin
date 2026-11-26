import { useState } from 'react'

// Keep activities available when revisiting a route in the current document.
// The existing checklist separately uses session storage across refreshes.
const activities = new Map<string, unknown>()

export function useActivityState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => activities.has(key) ? activities.get(key) as T : initial)
  function update(next: T) {
    activities.set(key, next)
    setValue(next)
  }
  return [value, update] as const
}
