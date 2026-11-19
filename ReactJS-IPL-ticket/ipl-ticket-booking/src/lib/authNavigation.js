export function safeReturnPath(from, fallback = '/booking') {
  const candidate =
    typeof from === 'string'
      ? from
      : from
        ? `${from.pathname || ''}${from.search || ''}${from.hash || ''}`
        : ''

  if (!candidate.startsWith('/') || candidate.startsWith('//')) {
    return fallback
  }
  return candidate
}

export function authCallbackUrl(nextPath, flow) {
  const callback = new URL('/auth/callback', window.location.origin)
  callback.searchParams.set('next', safeReturnPath(nextPath))
  if (flow) {
    callback.searchParams.set('flow', flow)
  }
  return callback.toString()
}
