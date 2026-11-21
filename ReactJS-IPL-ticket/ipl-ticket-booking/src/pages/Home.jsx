import { Link } from 'react-router-dom'
import cricketHero from '../assets/cricket-hero.svg'
import { matches, standPrices, formatCurrency } from '../data/matches'

function Home() {
  return (
    <main className="page-shell home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="section-kicker">The stands are calling</span>
          <h1>Make match day a memory.</h1>
          <p className="home-hero-description">
            Pick your fixture, find your seat, and get ready to feel every
            boundary with the crowd.
          </p>
          <div className="home-hero-actions">
            <Link className="home-cta home-cta-primary" to="/matches">
              Explore fixtures <span aria-hidden="true">→</span>
            </Link>
            <Link className="home-cta home-cta-secondary" to="/matches">
              Book tickets
            </Link>
          </div>
        </div>
        <div className="home-hero-image-wrap">
          <img
            className="home-hero-image"
            src={cricketHero}
            alt="Cricket ground ready for an exciting match"
          />
        </div>
      </section>

      <section className="home-trust-row" aria-label="Booking highlights">
        <div className="home-trust-item">
          <span className="home-trust-icon" aria-hidden="true">✓</span>
          <div>
            <strong>Simple booking</strong>
            <span>No account needed to book</span>
          </div>
        </div>
        <div className="home-trust-item">
          <span className="home-trust-icon" aria-hidden="true">₹</span>
          <div>
            <strong>Clear ticket prices</strong>
            <span>See your total before you book</span>
          </div>
        </div>
        <div className="home-trust-item">
          <span className="home-trust-icon" aria-hidden="true">▤</span>
          <div>
            <strong>Your passes stay close</strong>
            <span>Find saved passes in booking history</span>
          </div>
        </div>
      </section>

      <section className="home-fixtures" aria-labelledby="home-fixtures-title">
        <div className="home-section-heading">
          <div>
            <span className="section-kicker">Pick your next big moment</span>
            <h2 id="home-fixtures-title">Featured fixtures</h2>
          </div>
          <Link className="text-link" to="/matches">
            View all fixtures <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="matches-grid">
          {matches.map((match) => (
            <article className="match-card" key={match.id}>
              <div className="match-card-topline">
                <span className="sample-badge">Sample fixture</span>
                <span className="booking-count">Tickets from {formatCurrency(standPrices['General Stand'])}</span>
              </div>
              <h3 className="match-card-title">
                <span className={`team-badge team-${match.team1.toLowerCase()}`}>{match.team1}</span>
                <span className="team-versus">vs</span>
                <span className={`team-badge team-${match.team2.toLowerCase()}`}>{match.team2}</span>
              </h3>
              <div className="match-card-meta">
                <p><span className="match-meta-icon" aria-hidden="true">◷</span>{match.date}</p>
                <p><span className="match-meta-icon" aria-hidden="true">⌖</span>{match.venue}</p>
              </div>
              <div className="match-card-footer">
                <span className="match-price">
                  <span>VIP seats</span>
                  {formatCurrency(standPrices['VIP Stand'])}
                </span>
                <Link className="match-card-cta" to={`/booking?match=${match.id}`}>
                  Book now <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="home-fixture-note">
          Fixture dates shown here are examples, not official IPL schedule information.
        </p>
      </section>
    </main>
  )
}

export default Home
