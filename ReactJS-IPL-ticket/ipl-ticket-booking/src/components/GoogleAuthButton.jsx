import { useRef, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { authCallbackUrl } from '../lib/authNavigation'
import { supabase } from '../lib/supabase'

function GoogleAuthButton({ returnTo = '/booking' }) {
  const { user } = useAuth()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isStartingOAuth = useRef(false)

  async function handleGoogleSignIn() {
    if (isStartingOAuth.current) return
    isStartingOAuth.current = true
    setIsLoading(true)
    setError('')

    try {
      if (!supabase) {
        throw new Error('Supabase authentication is not configured.')
      }

      const isLinkingGuest = Boolean(user?.is_anonymous)
      const redirectTo = authCallbackUrl(
        returnTo,
        isLinkingGuest ? 'google-link' : undefined,
      )
      const { error: authError } = isLinkingGuest
        ? await supabase.auth.linkIdentity({
            provider: 'google',
            options: { redirectTo },
          })
        : await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo },
          })

      if (authError) {
        throw authError
      }
    } catch (authError) {
      setError(authError.message || 'Google sign-in could not be started.')
      isStartingOAuth.current = false
      setIsLoading(false)
    }
  }

  return (
    <div className="google-auth">
      <button
        className="google-auth-button"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <span className="google-mark" aria-hidden="true">G</span>
        {isLoading ? 'Connecting to Google...' : 'Continue with Google'}
      </button>
      {error && <p className="auth-error" role="alert">{error}</p>}
    </div>
  )
}

export default GoogleAuthButton
