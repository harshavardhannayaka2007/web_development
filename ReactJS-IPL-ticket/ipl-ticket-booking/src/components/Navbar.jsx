import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <header className="site-header">
      <Link className="nav-brand" to="/" aria-label="IPL Match Tickets home">
        <span className="nav-brand-mark" aria-hidden="true">✦</span>
        <span>IPL Match Tickets</span>
      </Link>

      <nav className="navbar-links" aria-label="Main navigation">
        <NavLink end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/">
          Home
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/matches">
          Matches
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/booking">
          Booking
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/history">
          Booking history
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
