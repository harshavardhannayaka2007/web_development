import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import { supabase } from '../lib/supabase'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(supabase))
  const [authError, setAuthError] = useState('')
  const [authEvent, setAuthEvent] = useState('')

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let active = true
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setAuthEvent(event)
        setAuthError('')
        setIsLoading(false)
      }
    })

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setAuthError(`Could not restore your session: ${error.message}`)
          setSession(null)
        } else {
          setSession(data.session)
          setAuthError('')
        }
        setIsLoading(false)
      })
      .catch((error) => {
        if (active) {
          setAuthError(`Could not restore your session: ${error.message}`)
          setSession(null)
          setIsLoading(false)
        }
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isLoading,
      authError,
      authEvent,
    }),
    [session, isLoading, authError, authEvent],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
