import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthShell from '../components/AuthShell'
import { supabase } from '../lib/supabase'

function ForgotPassword() {
  const [email, setEmail] = useState('')
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

    isSubmittingRef.current = true
    setIsSubmitting(true)
    setError('')
    setMessage('')

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: `${window.location.origin}/reset-password` },
      )
      if (resetError) {
        throw resetError
      }
      setMessage('If an account exists for that address, a password reset email has been sent.')
    } catch (resetError) {
      setError(resetError.message || 'The reset email could not be sent.')
    } finally {
      isSubmittingRef.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell activeTab="login">
      <div className="auth-card-content">
        <p className="auth-card-eyebrow">ACCOUNT RECOVERY</p>
        <h2>Reset your password</h2>
        <p className="auth-card-intro">
          Enter your account email and we&apos;ll send a secure reset link.
        </p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="reset-email">
            <span>Email address</span>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send reset link'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="auth-switch">
          Remembered your password? <Link to="/login">Return to login</Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default ForgotPassword
