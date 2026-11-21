import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import TicketPass from '../components/TicketPass'
import { formatCurrency, matches, standPrices, stadiumSections } from '../data/matches'
import { saveBooking } from '../lib/bookings'
import bookingIllustration from '../assets/booking-illustration.svg'

function Booking() {
  const [searchParams] = useSearchParams()
  const selectedMatch = matches.find((match) => match.id === searchParams.get('match'))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [tickets, setTickets] = useState('1')
  const [stand, setStand] = useState('')
  const [position, setPosition] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const isBookingInProgress = useRef(false)

  const quantity = Number(tickets)
  const validTicketCount = tickets !== '' && Number.isSafeInteger(quantity) && quantity > 0
  const pricePerTicket = standPrices[stand] ?? null
  const amount =
    validTicketCount && pricePerTicket !== null && Number.isSafeInteger(pricePerTicket * quantity)
      ? pricePerTicket * quantity
      : null
  const hasCompleteBooking =
    Boolean(name.trim()) &&
    Boolean(email.trim()) &&
    Boolean(selectedMatch) &&
    Boolean(position) &&
    validTicketCount &&
    pricePerTicket !== null &&
    amount !== null

  if (!selectedMatch) {
    return (
      <main className="page-shell booking-page">
        <PageBanner
          tone="booking"
          eyebrow="BOOK YOUR MATCH-DAY SEATS"
          title="Choose a match first"
          description="Select a fixture to see its date and venue on your booking form."
          image={bookingIllustration}
          imageAlt="Illustration of a cricket match ticket and ball"
        />
        <div className="empty-state booking-prompt">
          <span className="empty-state-icon" aria-hidden="true">✦</span>
          <h2>Your pass starts with a fixture</h2>
          <p>Browse the sample matches, then select Book now to carry your match into the form.</p>
          <Link className="button button-primary" to="/matches">
            Browse matches <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    )
  }

  async function handleBooking(event) {
    event.preventDefault()

    if (isBookingInProgress.current) return
    if (!hasCompleteBooking || amount === null || pricePerTicket === null) {
      setError('Complete the required fields and choose a valid ticket quantity.')
      return
    }

    isBookingInProgress.current = true
    setError('')
    setIsSubmitting(true)

    try {
      const booking = await saveBooking({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        match_id: selectedMatch.id,
        match_name: `${selectedMatch.team1} vs ${selectedMatch.team2}`,
        match_date: selectedMatch.date,
        tickets: quantity,
        stand,
        position,
        venue: selectedMatch.venueOption,
        place: selectedMatch.venue,
        price_per_ticket: pricePerTicket,
        amount,
      })
      setConfirmedBooking(booking)
    } catch (bookingError) {
      setError(bookingError.message || 'The booking could not be saved.')
    } finally {
      isBookingInProgress.current = false
      setIsSubmitting(false)
    }
  }

  if (confirmedBooking) {
    return (
      <main className="page-shell booking-page">
        <section className="pass-confirmation">
          <div className="pass-confirmation-heading">
            <span className="pass-confirmation-icon" aria-hidden="true">✓</span>
            <div>
              <span className="section-kicker">Booking saved</span>
              <h1>Your match-day pass is ready.</h1>
              <p>
                Your booking is saved in Supabase. This pass will appear in Booking History on this browser.
              </p>
            </div>
          </div>
          <TicketPass booking={confirmedBooking} />
          <p className="pass-demo-note">
            Demo pass only: this site does not process payments or verify venue entry.
          </p>
          <div className="pass-confirmation-actions">
            <Link className="button button-primary" to="/history">View booking history</Link>
            <Link className="button button-quiet" to="/matches">Explore more matches</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="page-shell booking-page">
      <PageBanner
        tone="booking"
        eyebrow="YOUR MATCH-DAY PLANS START HERE"
        title="Book your seats"
        description="Add your details, choose a ticket type and stadium section, and review your total before confirming."
        image={bookingIllustration}
        imageAlt="Illustration of a cricket match ticket and ball"
      />

      <div className="booking-layout">
        <form className="booking-form" onSubmit={handleBooking}>
          <div className="booking-form-heading">
            <span className="section-kicker">Selected from matches</span>
            <h2>{selectedMatch.team1} vs {selectedMatch.team2}</h2>
            <p>{selectedMatch.date} · {selectedMatch.venue}</p>
          </div>

          <label htmlFor="name">
            Full name
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Name on the pass"
              autoComplete="name"
              minLength={2}
              required
            />
          </label>

          <label htmlFor="email">
            Email address
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label htmlFor="tickets">
            Number of tickets
            <input
              id="tickets"
              type="number"
              min="1"
              step="1"
              value={tickets}
              onChange={(event) => setTickets(event.target.value)}
              required
            />
          </label>

          <label htmlFor="stand">
            Ticket stand
            <select
              id="stand"
              value={stand}
              onChange={(event) => setStand(event.target.value)}
              required
            >
              <option value="">Choose a ticket type</option>
              <option value="General Stand">General Stand · {formatCurrency(standPrices['General Stand'])}</option>
              <option value="VIP Stand">VIP Stand · {formatCurrency(standPrices['VIP Stand'])}</option>
            </select>
          </label>

          <label htmlFor="position">
            Stadium section
            <select
              id="position"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              required
            >
              <option value="">Choose a section</option>
              {stadiumSections.map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </label>

          <label htmlFor="phone">
            Phone number <span className="optional-label">Optional</span>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="For booking contact"
              autoComplete="tel"
            />
          </label>

          <p className="field-note">
            Stadium sections are sample choices, not live seat availability. Booking details are saved in Supabase; email and SMS confirmations are not sent.
          </p>

          <div className="booking-price-preview" aria-live="polite">
            <div className="booking-price-row">
              <span>Price per ticket</span>
              <strong>{pricePerTicket === null ? 'Choose a ticket type' : formatCurrency(pricePerTicket)}</strong>
            </div>
            <div className="booking-price-row">
              <span>Tickets</span>
              <strong>{validTicketCount ? quantity : 'Enter a valid quantity'}</strong>
            </div>
            <div className="booking-price-row booking-price-row--total">
              <span>Total booking amount</span>
              <strong>{amount === null ? '—' : formatCurrency(amount)}</strong>
            </div>
          </div>

          {error && <p className="booking-error" role="alert">{error}</p>}

          <button className="button button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving your booking…' : 'Confirm booking'}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <aside className="booking-details" aria-live="polite">
          <div className="booking-details-heading">
            <span className="booking-details-icon" aria-hidden="true">✦</span>
            <div>
              <h2>Booking summary</h2>
              <p>Your selected match and estimated total.</p>
            </div>
          </div>
          <dl className="booking-summary-list">
            <div>
              <dt>Match</dt>
              <dd>{selectedMatch.team1} vs {selectedMatch.team2}</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>{selectedMatch.date}</dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{selectedMatch.venue}</dd>
            </div>
            <div>
              <dt>Stand</dt>
              <dd>{stand || 'Choose a ticket type'}</dd>
            </div>
            <div>
              <dt>Stadium section</dt>
              <dd>{position || 'Choose a section'}</dd>
            </div>
            <div className="booking-summary-total">
              <dt>Total booking amount</dt>
              <dd>{amount === null ? '—' : formatCurrency(amount)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </main>
  )
}

export default Booking
