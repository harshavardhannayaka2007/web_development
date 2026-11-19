import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, matches, standPrices } from '../data/matches'
import { saveBooking } from '../lib/bookings'
import PageBanner from '../components/PageBanner'
import bookingIllustration from '../assets/booking-illustration.svg'

function Booking() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [tickets, setTickets] = useState('')
  const [stand, setStand] = useState('')
  const [venue, setVenue] = useState('')
  const [selectedMatchId, setSelectedMatchId] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isBookingInProgress = useRef(false)

  const selectedMatch = matches.find((match) => match.id === selectedMatchId)
  const quantity = Number(tickets)
  const validTicketCount = tickets !== '' && Number.isSafeInteger(quantity) && quantity > 0
  const pricePerTicket = standPrices[stand] ?? null
  const previewAmount =
    validTicketCount && pricePerTicket !== null && Number.isSafeInteger(pricePerTicket * quantity)
      ? pricePerTicket * quantity
      : null
  const hasCompleteBooking =
    Boolean(name.trim()) &&
    Boolean(selectedMatch) &&
    selectedMatch?.venueOption === venue &&
    Boolean(stand) &&
    validTicketCount &&
    pricePerTicket !== null &&
    Number.isSafeInteger(pricePerTicket * quantity)
  const amount = hasCompleteBooking ? pricePerTicket * quantity : null

  async function handleBooking(event) {
    event.preventDefault()

    if (isBookingInProgress.current) {
      return
    }

    if (!hasCompleteBooking || !selectedMatch || pricePerTicket === null || amount === null) {
      setError('Please enter your name and choose a match, valid number of tickets, stand, and venue.')
      return
    }

    isBookingInProgress.current = true
    setError('')
    setIsSubmitting(true)

    try {
      await saveBooking({
        name: name.trim(),
        tickets: quantity,
        stand,
        venue,
        place: venue,
      })
      alert(`Ticket booked successfully! Total amount: ${formatCurrency(amount)}`)
      navigate('/history')
    } catch (bookingError) {
      setError(bookingError.message || 'The booking could not be saved.')
    } finally {
      isBookingInProgress.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell booking-page">
      <PageBanner
        tone="booking"
        eyebrow="YOUR SEAT IS WAITING"
        title="Book Your Ticket"
        description="Fixture dates are examples; check the official schedule before booking."
        image={bookingIllustration}
        imageAlt="Illustration of a cricket match ticket and ball"
      />

      <form className="booking-form" onSubmit={handleBooking}>
        <label htmlFor="match">Select Match</label>
        <select
          id="match"
          value={selectedMatchId}
          onChange={(event) => {
            const match = matches.find((item) => item.id === event.target.value)
            setSelectedMatchId(event.target.value)
            setVenue(match?.venueOption ?? '')
          }}
          required
        >
          <option value="">-- Select Match --</option>
          {matches.map((match) => (
            <option key={match.id} value={match.id}>
              {match.team1} vs {match.team2} ({match.date})
            </option>
          ))}
        </select>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="tickets">Number of Tickets</label>
        <input
          id="tickets"
          type="number"
          min="1"
          step="1"
          value={tickets}
          onChange={(event) => setTickets(event.target.value)}
          placeholder="Enter number of tickets"
          required
        />

        <label htmlFor="stand">Select Stand</label>
        <select
          id="stand"
          value={stand}
          onChange={(event) => setStand(event.target.value)}
          required
        >
          <option value="">-- Select Stand --</option>
          <option value="General Stand">General Stand</option>
          <option value="VIP Stand">VIP Stand</option>
        </select>

        <label htmlFor="venue">Select Venue</label>
        <select
          id="venue"
          value={venue}
          onChange={(event) => {
            setVenue(event.target.value)
            const match = matches.find((item) => item.venueOption === event.target.value)
            setSelectedMatchId(match?.id ?? '')
          }}
          required
        >
          <option value="">-- Select Venue --</option>
          {matches.map((match) => (
            <option key={match.venueOption} value={match.venueOption}>
              {match.venueOption}
            </option>
          ))}
        </select>

        <div aria-live="polite">
          <p>Price per ticket: <strong>{pricePerTicket === null ? 'Select a stand' : formatCurrency(pricePerTicket)}</strong></p>
          <p>Total amount payable: <strong>{previewAmount === null ? 'Enter a valid ticket quantity' : formatCurrency(previewAmount)}</strong></p>
        </div>

        {error && <p className="booking-error" role="alert">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Book Ticket'}
        </button>
      </form>

      <section className="booking-details" aria-live="polite">
        <h2>Booking Details</h2>
        <p>Match: <strong>{selectedMatch ? `${selectedMatch.team1} vs ${selectedMatch.team2}` : '-'}</strong></p>
        <p>Date: <strong>{selectedMatch?.date || '-'}</strong></p>
        <p>Name: <strong>{name || '-'}</strong></p>
        <p>Tickets: <strong>{tickets || '-'}</strong></p>
        <p>Stand: <strong>{stand || '-'}</strong></p>
        <p>Venue: <strong>{venue || '-'}</strong></p>
        <p>Price per ticket: <strong>{pricePerTicket === null ? '-' : formatCurrency(pricePerTicket)}</strong></p>
        <p>Total amount payable: <strong>{amount === null ? '-' : formatCurrency(amount)}</strong></p>
      </section>
    </main>
  )
}

export default Booking
