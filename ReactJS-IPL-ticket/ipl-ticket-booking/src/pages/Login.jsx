import { useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import GoogleAuthButton from '../components/GoogleAuthButton'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/useAuth'
import { safeReturnPath } from '../lib/authNavigation'
import { supabase } from '../lib/supabase'

function Login() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(location.state?.authError || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)
  const returnTo = safeReturnPath(location.state?.from)

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

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError('')

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (authError) {
        throw authError
      }
      navigate(returnTo, { replace: true })
    } catch (authError) {
      setError(authError.message || 'We could not sign you in. Please try again.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell activeTab="login">
      <div className="auth-card-content">
        <p className="auth-card-eyebrow">WELCOME BACK</p>
        <h2>Sign in to your account</h2>
        <p className="auth-card-intro">Sign in to book tickets and manage your account.</p>

        {user?.is_anonymous && (
          <p className="auth-info" role="status">
            You have a guest booking session. Register to preserve its booking
            history, or sign in to an existing account without transferring guest bookings.
          </p>
        )}
        {error && <p className="auth-error" role="alert">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="login-email">
            <span>Email address</span>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <PasswordField
            id="login-password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />

          <div className="auth-form-options">
            <span>Session stays active on this device</span>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>
        <GoogleAuthButton returnTo={returnTo} />
        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register" state={{ from: location.state?.from }}>Register here</Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default Login
