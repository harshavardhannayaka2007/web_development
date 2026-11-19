import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'

function Profile() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return <ProfileEditor key={user.id} user={user} />
}

function ProfileEditor({ user }) {
  const [fullName, setFullName] = useState(user.user_metadata?.full_name || '')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!supabase || !user) {
      setError('Your account session is unavailable. Please sign in again.')
      return
    }
    if (fullName.trim().length < 2) {
      setError('Enter your full name.')
      return
    }

    setIsSaving(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      })
      if (updateError) {
        throw updateError
      }
      setMessage('Your profile was updated.')
    } catch (updateError) {
      setError(updateError.message || 'Your profile could not be updated.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="page-shell profile-page">
      <section className="profile-card">
        <p className="auth-card-eyebrow">MY ACCOUNT</p>
        <h1>Profile</h1>
        <p className="profile-email">{user?.email}</p>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {message && <p className="auth-success" role="status">{message}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field" htmlFor="profile-name">
            <span>Full name</span>
            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              minLength={2}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </label>
          <label className="auth-field" htmlFor="profile-email">
            <span>Email address</span>
            <input id="profile-email" type="email" value={user?.email || ''} readOnly />
          </label>
          <button className="auth-submit" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Profile
