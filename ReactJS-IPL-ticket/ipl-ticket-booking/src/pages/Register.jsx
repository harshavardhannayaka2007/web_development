import { useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import GoogleAuthButton from '../components/GoogleAuthButton'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/useAuth'
import { authCallbackUrl, safeReturnPath } from '../lib/authNavigation'
import { supabase } from '../lib/supabase'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Register() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)
  const returnTo = safeReturnPath(location.state?.from)
  const isGuestUpgrade = Boolean(user?.is_anonymous)

  if (!isAuthLoading && user && !user.is_anonymous) {
    return <Navigate to={returnTo} replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmittingRef.current) return

    if (!supabase) {
      setError('Supabase authentication is not configured.')
      return
    }
    if (fullName.trim().length < 2) {
      setError('Enter your full name.')
      return
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions to continue.')
      return
    }
    if (!isGuestUpgrade && password.length < 8) {
      setError('Choose a password with at least 8 characters.')
      return
    }
    if (!isGuestUpgrade && password !== confirmPassword) {
      setError('The passwords do not match.')
      return
    }

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      if (isGuestUpgrade) {
        const { error: updateError } = await supabase.auth.updateUser(
          {
            email: email.trim(),
            data: { full_name: fullName.trim() },
          },
          { emailRedirectTo: authCallbackUrl(returnTo, 'email-upgrade') },
        )
        if (updateError) {
          throw updateError
        }
        setMessage(
          'Check your email and confirm the address. You will set your password after returning through the verification link; your guest booking history stays attached to this account.',
        )
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: fullName.trim() },
            emailRedirectTo: authCallbackUrl(returnTo, 'register'),
          },
        })
        if (signUpError) {
          throw signUpError
        }

        if (data.session) {
          navigate(returnTo, { replace: true })
        } else {
          setMessage(
            'Registration was submitted. Check your email and verify your address before logging in.',
          )
        }
      }
    } catch (authError) {
      setError(authError.message || 'Registration could not be completed. Please try again.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell activeTab="register">
      <div className="auth-card-content">
        <p className="auth-card-eyebrow">JOIN THE MATCH DAY</p>
        <h2>Create your account</h2>
        <p className="auth-card-intro">
          Save your bookings and get ready for the next big match.
        </p>

        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="register-name">
            <span>Full name</span>
            <input
              id="register-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              minLength={2}
              required
            />
          </label>

          <label className="auth-field" htmlFor="register-email">
            <span>Email address</span>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          {!isGuestUpgrade && (
            <>
              <PasswordField
                id="register-password"
                label="Password (at least 8 characters)"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
              <PasswordField
                id="register-confirm-password"
                label="Confirm password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
              />
            </>
          )}

          {isGuestUpgrade && (
            <p className="auth-info">
              Verify your email first, then set a password. This two-step upgrade
              preserves your existing guest bookings.
            </p>
          )}

          <label className="auth-terms" htmlFor="register-terms">
            <input
              id="register-terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
            />
            <span>I agree to the terms and conditions.</span>
          </label>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : isGuestUpgrade ? 'Verify email' : 'Create account'}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <GoogleAuthButton returnTo={returnTo} />
        <p className="auth-switch">
          Already have an account? <Link to="/login" state={{ from: location.state?.from }}>Login</Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default Register
