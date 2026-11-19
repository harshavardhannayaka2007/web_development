import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { supabase } from '../lib/supabase'

function Navbar() {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [logoutError, setLogoutError] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)
  const isAuthenticated = Boolean(user && !user.is_anonymous)
  const isAuthRoute = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/auth/callback',
  ].includes(location.pathname)

  async function handleLogout() {
    if (!supabase) {
      setLogoutError('Supabase authentication is not configured.')
      return
    }

    setIsSigningOut(true)
    setLogoutError('')
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) {
        throw error
      }
      navigate('/', { replace: true })
    } catch (error) {
      setLogoutError(error.message || 'You could not be signed out.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <nav className={`navbar${isAuthRoute ? ' navbar--auth' : ''}`}>
      <div className="nav-brand">IPL Ticket Booking</div>

      <div className="navbar-links">
        <NavLink end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/">
          Home
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/matches">
          Matches
        </NavLink>
        {isAuthenticated ? (
          <>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/booking">
              Book Tickets
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/history">
              My Bookings
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/account">
              {user.user_metadata?.full_name || user.email || 'My Account'}
            </NavLink>
            <button
              className="nav-logout"
              type="button"
              onClick={handleLogout}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Logout'}
            </button>
          </>
        ) : isLoading ? (
          <span className="nav-session-status">Restoring session...</span>
        ) : (
          <>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/login">
              Login
            </NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/register">
              Register
            </NavLink>
          </>
        )}
      </div>
      {logoutError && <p className="nav-error" role="alert">{logoutError}</p>}
    </nav>
  )
}

export default Navbar
