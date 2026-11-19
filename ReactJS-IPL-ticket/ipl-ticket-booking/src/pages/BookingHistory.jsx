import { useEffect, useState } from 'react'
import { formatCurrency, matches, standPrices } from '../data/matches'
import { getBookingsByVenue } from '../lib/bookings'
import PageBanner from '../components/PageBanner'
import historyIllustration from '../assets/history-illustration.svg'

function BookingHistory() {
  const [selectedVenue, setSelectedVenue] = useState('all')
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getBookingsByVenue(selectedVenue)
      .then((results) => {
        if (active) {
          setBookings(results)
          setError('')
        }
      })
      .catch((loadError) => {
        if (active) {
          setBookings([])
          setError(loadError.message || 'Could not load booking history.')
        }
      })

    return () => {
      active = false
    }
  }, [selectedVenue])

  return (
    <main className="page-shell">
      <PageBanner
        tone="history"
        eyebrow="YOUR MATCH-DAY PLANS"
        title="Booking History"
        description="Review your ticket details and filter bookings by venue."
        image={historyIllustration}
        imageAlt="Illustration of a booking checklist with confirmed tickets"
      />
      <div className="history-toolbar">
        <label className="filter-control" htmlFor="venue-filter">
          Filter by venue
          <select
            id="venue-filter"
            value={selectedVenue}
            onChange={(event) => {
              setBookings(null)
              setSelectedVenue(event.target.value)
            }}
          >
            <option value="all">All venues</option>
            {matches.map((match) => (
              <option key={match.id} value={match.venueOption}>
                {match.venueOption}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="history-error" role="alert">{error}</p>}
      {bookings === null ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="empty-state">No booking history yet.</div>
      ) : (
        <div className="history-list">
          {bookings.map((booking) => {
            const fixture = matches.find(
              (match) => booking.venue === match.venueOption || booking.venue === match.venue,
            )
            const matchName =
              booking.match_name ||
              booking.match ||
              (fixture ? `${fixture.team1} vs ${fixture.team2}` : 'Match details unavailable')
            const matchDate =
              booking.match_date ||
              booking.date ||
              fixture?.date ||
              (booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '-')
            const pricePerTicket = booking.price_per_ticket ?? standPrices[booking.stand]
            const totalAmount =
              booking.amount ??
              booking.price ??
              (pricePerTicket != null && Number.isSafeInteger(pricePerTicket * booking.tickets)
                ? pricePerTicket * booking.tickets
                : null)

            return (
              <article key={booking.id} className="history-card">
                <h2>{matchName}</h2>
                <p>Date: {matchDate}</p>
                <p>Name: {booking.name}</p>
                <p>Tickets: {booking.tickets}</p>
                <p>Stand: {booking.stand}</p>
                <p>Venue: {booking.venue || booking.place}</p>
                {pricePerTicket != null && (
                  <p>Price per ticket: {formatCurrency(pricePerTicket)}</p>
                )}
                {totalAmount != null && (
                  <p>Total amount: {formatCurrency(totalAmount)}</p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default BookingHistory
