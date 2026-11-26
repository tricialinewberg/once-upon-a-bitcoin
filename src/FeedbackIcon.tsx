export function FeedbackIcon({kind}: {kind: 'success' | 'error' | 'shield-x' | 'x'}) {
  const check = kind === 'success'
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'shield-x' ? <path d="M12 3l8 3v5.5c0 4-3 7-8 9.5-5-2.5-8-5.5-8-9.5V6l8-3Z" />
      : kind !== 'x' && <circle cx="12" cy="12" r="9" />}
    {check ? <path d="m8 12 2.5 2.5L16 9" /> : <path d="m9 9 6 6m0-6-6 6" />}
  </svg>
}
