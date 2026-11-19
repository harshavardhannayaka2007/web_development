import { formatCurrency, matches, standPrices } from '../data/matches'
import PageBanner from '../components/PageBanner'
import matchesIllustration from '../assets/matches-illustration.svg'

function MatchCard({ team1, team2, venue, date }) {
  return (
    <article className="match-card">
      <h2 className="team-matchup">
        <span className={`team-badge team-${team1.toLowerCase()}`}>{team1}</span>
        <span className="team-versus">vs</span>
        <span className={`team-badge team-${team2.toLowerCase()}`}>{team2}</span>
      </h2>
      <p>📍 {venue}</p>
      <p>📅 {date}</p>
      <p>Ticket prices: General {formatCurrency(standPrices['General Stand'])} · VIP {formatCurrency(standPrices['VIP Stand'])}</p>
    </article>
  )
}

function Matches() {
  return (
    <main className="page-shell">
      <PageBanner
        tone="matches"
        eyebrow="FIND YOUR FIXTURE"
        title="Upcoming IPL Matches"
        description="Fixture dates are examples; check the official schedule before booking."
        image={matchesIllustration}
        imageAlt="Illustration of a cricket scoreboard and stadium lights"
      />
      <div className="matches-grid">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            team1={match.team1}
            team2={match.team2}
            venue={match.venue}
            date={match.date}
          />
        ))}
      </div>
    </main>
  )
}

export default Matches
