import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import TicketPass from '../components/TicketPass'
import historyIllustration from '../assets/history-illustration.svg'
import { formatCurrency, matches, standPrices } from '../data/matches'
import { getBookingsByVenue } from '../lib/bookings'

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
        eyebrow="YOUR MATCH-DAY COLLECTION"
        title="Booking history"
        description="Find your saved bookings and colour-coded passes. Only passes saved on this browser are shown."
        image={historyIllustration}
        imageAlt="Illustration of a booking checklist with confirmed tickets"
      />

      <div className="history-toolbar">
        <p className="history-toolbar-copy">
          {error
            ? 'Booking history could not be loaded'
            : bookings === null
            ? 'Loading your bookings…'
            : `${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`}
        </p>
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
              <option key={match.id} value={match.venueOption}>{match.venueOption}</option>
            ))}
          </select>
        </label>
      </div>

      {bookings === null ? (
        <p className="history-loading" role="status">Loading your bookings…</p>
      ) : error ? (
        <div className="empty-state" role="alert">
          <span className="empty-state-icon" aria-hidden="true">!</span>
          <h2>Couldn’t load your booking history</h2>
          <p>{error}</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">✦</span>
          <h2>Your next match starts here</h2>
          <p>There are no bookings to show yet. Choose a fixture and your pass will appear here.</p>
          <Link className="button button-primary" to="/matches">
            Explore matches <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {bookings.map((booking) => {
            const fixture = matches.find(
              (match) =>
                match.id === booking.match_id ||
                booking.venue === match.venueOption ||
                booking.venue === match.venue ||
                booking.place === match.venue,
            )
            const pricePerTicket = booking.price_per_ticket ?? standPrices[booking.stand]
            const totalAmount =
              booking.amount ??
              booking.price ??
              (pricePerTicket != null && Number.isSafeInteger(pricePerTicket * booking.tickets)
                ? pricePerTicket * booking.tickets
                : null)
            const passBooking = {
              ...booking,
              match_name:
                booking.match_name ||
                booking.match ||
                (fixture ? `${fixture.team1} vs ${fixture.team2}` : 'Match details unavailable'),
              match_date:
                booking.match_date ||
                booking.date ||
                fixture?.date ||
                (booking.created_at ? new Date(booking.created_at).toLocaleDateString() : '—'),
              venue: booking.venue || booking.place || fixture?.venueOption || '—',
              position: booking.position || 'Not recorded',
              ticket_code: booking.ticket_code || `BS-${booking.id}`,
              price_per_ticket: pricePerTicket,
              amount: totalAmount,
            }

            return (
              <section className="history-card" key={booking.id}>
                <TicketPass booking={passBooking} />
                <div className="history-contact">
                  <p><span>Booking email</span><strong>{booking.email || 'Not recorded'}</strong></p>
                  {booking.phone && (
                    <p><span>Contact phone</span><strong>{booking.phone}</strong></p>
                  )}
                  {pricePerTicket != null && (
                    <p><span>Price per ticket</span><strong>{formatCurrency(pricePerTicket)}</strong></p>
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}

export default BookingHistory
