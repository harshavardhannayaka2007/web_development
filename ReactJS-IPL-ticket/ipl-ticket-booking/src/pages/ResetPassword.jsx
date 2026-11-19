import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import PasswordField from '../components/PasswordField'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'

function ResetPassword() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSubmittingRef = useRef(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (isSubmittingRef.current) return
    if (!supabase) {
      setError('Supabase authentication is not configured.')
      return
    }
    if (!user || user.is_anonymous) {
      setError('This reset link is invalid or expired. Request a new reset email.')
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
    setMessage('')

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        throw updateError
      }
      setMessage('Your password has been updated.')
      window.setTimeout(() => navigate('/login', { replace: true }), 900)
    } catch (updateError) {
      setError(updateError.message || 'The password could not be updated.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell activeTab="login">
      <div className="auth-card-content">
        <p className="auth-card-eyebrow">SECURE YOUR ACCOUNT</p>
        <h2>Choose a new password</h2>
        <p className="auth-card-intro">
          Use at least 8 characters for your new password.
        </p>
        {!isLoading && (!user || user.is_anonymous) && (
          <p className="auth-info" role="status">
            Open a valid password-reset link to continue. Reset links may expire
            or be used only once.
          </p>
        )}
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <PasswordField
            id="new-password"
            label="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
          />
          <PasswordField
            id="confirm-new-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
          />
          <button
            className="auth-submit"
            type="submit"
            disabled={isSubmitting || isLoading || !user || user.is_anonymous}
          >
            {isSubmitting ? 'Updating...' : 'Update password'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="auth-switch"><Link to="/login">Return to login</Link></p>
      </div>
    </AuthShell>
  )
}

export default ResetPassword
