import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function ProtectedRoute({ children }) {
  const { user, isLoading, authError } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="auth-loading" aria-live="polite">
        Restoring your account...
      </main>
    )
  }

  if (!user || user.is_anonymous) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, authError }}
      />
    )
  }

  return children
}

export default ProtectedRoute
