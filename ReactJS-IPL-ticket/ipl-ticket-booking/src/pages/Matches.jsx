import { Link } from 'react-router-dom'
import { formatCurrency, matches, standPrices } from '../data/matches'
import PageBanner from '../components/PageBanner'
import matchesIllustration from '../assets/matches-illustration.svg'

function MatchCard({ match }) {
  const { id, team1, team2, venue, date } = match

  return (
    <article className="match-card">
      <div className="match-card-topline">
        <span className="sample-badge">Sample fixture</span>
        <span className="booking-count">Ticket options</span>
      </div>
      <h2 className="match-card-title">
        <span className={`team-badge team-${team1.toLowerCase()}`}>{team1}</span>
        <span className="team-versus">vs</span>
        <span className={`team-badge team-${team2.toLowerCase()}`}>{team2}</span>
      </h2>
      <div className="match-card-meta">
        <p><span className="match-meta-icon" aria-hidden="true">◷</span>{date}</p>
        <p><span className="match-meta-icon" aria-hidden="true">⌖</span>{venue}</p>
      </div>
      <div className="match-card-footer">
        <span className="match-price">
          <span>Per ticket</span>
          {formatCurrency(standPrices['General Stand'])} · {formatCurrency(standPrices['VIP Stand'])}
        </span>
        <Link className="match-card-cta" to={`/booking?match=${id}`}>
          Book now <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}

function Matches() {
  return (
    <main className="page-shell">
      <PageBanner
        tone="matches"
        eyebrow="FIND YOUR FIXTURE"
        title="Find your next fixture"
        description="Explore sample matchups, compare ticket options, and choose where you want to be when the action begins. Dates shown are examples, not the official schedule."
        image={matchesIllustration}
        imageAlt="Illustration of a cricket scoreboard and stadium lights"
      />
      <div className="matches-grid">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </main>
  )
}

export default Matches
