import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/useAuth'
import { safeReturnPath } from '../lib/authNavigation'
import { supabase } from '../lib/supabase'

function AuthCallback() {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const flow = params.get('flow')
  const returnTo = safeReturnPath(params.get('next'))
  const providerError = params.get('error_description') || params.get('error')
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)
  const handledCallback = useRef(false)
  const emailIsConfirmed = Boolean(user?.email_confirmed_at || user?.confirmed_at)
  const needsPassword = flow === 'email-upgrade' && emailIsConfirmed
  const callbackError =
    providerError ||
    error ||
    (!isLoading && !user
      ? 'This authentication link is invalid, expired, or already used.'
      : flow === 'email-upgrade' && user && !emailIsConfirmed
        ? 'Confirm your email address before continuing.'
        : flow !== 'email-upgrade' && user?.is_anonymous
          ? 'The account upgrade did not finish. Please try again.'
          : '')

  useEffect(() => {
    if (isLoading || handledCallback.current || providerError) return
    if (!user) return
    if (flow === 'email-upgrade') {
      if (!emailIsConfirmed) return
      handledCallback.current = true
      return
    }
    if (user.is_anonymous) return
    handledCallback.current = true
    navigate(returnTo, { replace: true })
  }, [emailIsConfirmed, flow, isLoading, navigate, providerError, returnTo, user])

  async function handleSetPassword(event) {
    event.preventDefault()
    if (isSubmittingRef.current) return
    if (
      !supabase ||
      !user ||
      (!user.email_confirmed_at && !user.confirmed_at)
    ) {
      setError('Your verified account session is unavailable. Restart registration.')
      return
    }
    if (password.length < 8) {
      setError('Choose a password with at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError('')
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        throw updateError
      }
      if (data.user?.is_anonymous) {
        throw new Error('Email verified, but the account is still anonymous. Please try again.')
      }
      handledCallback.current = true
      navigate(returnTo, { replace: true })
    } catch (updateError) {
      setError(updateError.message || 'The account password could not be set.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell activeTab="login">
      <div className="auth-card-content">
        <p className="auth-card-eyebrow">SECURE REDIRECT</p>
        <h2>{needsPassword ? 'Finish your registration' : 'Verifying your account'}</h2>
        {needsPassword ? (
          <>
            <p className="auth-card-intro">
              Your email is verified. Set a password to finish upgrading your
              guest account and keep its booking history.
            </p>
            {callbackError && <p className="auth-error" role="alert">{callbackError}</p>}
            <form className="auth-form" onSubmit={handleSetPassword}>
              <PasswordField
                id="upgrade-password"
                label="Password (at least 8 characters)"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
              <PasswordField
                id="upgrade-confirm-password"
                label="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
              <button className="auth-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving password...' : 'Finish registration'}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </>
        ) : (
          <p className={callbackError ? 'auth-error' : 'auth-card-intro'} role={callbackError ? 'alert' : 'status'}>
            {callbackError || 'Restoring your secure session...'}
          </p>
        )}
      </div>
    </AuthShell>
  )
}

export default AuthCallback
