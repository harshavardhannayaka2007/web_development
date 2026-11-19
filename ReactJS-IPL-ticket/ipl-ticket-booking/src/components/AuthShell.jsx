import { NavLink } from 'react-router-dom'

function AuthShell({ activeTab, children }) {
  return (
    <main className="auth-page">
      <div className="auth-layout">
        <section
          className="auth-hero"
          aria-label="IPL ticket booking"
          style={{ '--auth-stadium-image': "url('/images/cricket-stadium-hero.jpg')" }}
        >
          <div className="auth-hero-copy">
            <p className="auth-eyebrow">YOUR MATCH DAY STARTS HERE</p>
            <h1>
              IPL TICKET
              <span>BOOKING</span>
            </h1>
            <p className="auth-hero-tagline">Live the excitement.</p>
            <p className="auth-hero-description">
              Book your IPL match tickets and be part of the biggest cricket
              festival.
            </p>
            <div className="auth-benefits">
              <span><b aria-hidden="true">✓</b> Secure booking</span>
              <span><b aria-hidden="true">◆</b> Clear pricing</span>
              <span><b aria-hidden="true">★</b> Match-day ready</span>
            </div>
          </div>
        </section>

        <section className="auth-card-column">
          <div className="auth-card">
            <div className="auth-tabs" aria-label="Account access">
              <NavLink
                to="/login"
                className={activeTab === 'login' ? 'auth-tab active' : 'auth-tab'}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={activeTab === 'register' ? 'auth-tab active' : 'auth-tab'}
              >
                Register
              </NavLink>
            </div>
            {children}
          </div>
        </section>
      </div>

      <footer className="auth-footer">
        <span><b aria-hidden="true">🏆</b> IPL match days</span>
        <span><b aria-hidden="true">◎</b> Iconic venues</span>
        <span><b aria-hidden="true">✦</b> Cricket unites us</span>
      </footer>
    </main>
  )
}

export default AuthShell
