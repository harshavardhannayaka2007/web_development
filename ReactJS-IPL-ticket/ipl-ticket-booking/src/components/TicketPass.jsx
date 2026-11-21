import { formatCurrency } from '../data/matches'

function TicketPass({ booking }) {
  const isVip = booking.stand === 'VIP Stand'
  const ticketCount = Number(booking.tickets) || 0
  const pricePerTicket = Number(booking.price_per_ticket)
  const total = Number.isFinite(Number(booking.amount))
    ? Number(booking.amount)
    : Number.isFinite(pricePerTicket)
      ? pricePerTicket * ticketCount
      : null

  return (
    <article
      className={`ticket-pass${isVip ? ' ticket-pass--vip' : ' ticket-pass--general'}`}
      aria-label={`${booking.stand || 'Match'} colour-coded ticket pass`}
    >
      <div className="ticket-pass-main">
        <div className="ticket-pass-topline">
          <span className="ticket-pass-brand"><span aria-hidden="true">✦</span> IPL MATCH TICKETS</span>
          <span className="ticket-pass-status">{booking.status || 'Confirmed'}</span>
        </div>

        <p className="ticket-pass-kicker">MATCH DAY PASS</p>
        <h2 className="ticket-pass-match">
          {booking.match_name || booking.match || 'Cricket match'}
        </h2>
        <p className="ticket-pass-date">{booking.match_date || booking.date || 'Match date'}</p>

        <div className="ticket-pass-details">
          <div>
            <span>Venue</span>
            <strong>{booking.venue || booking.place || '—'}</strong>
          </div>
          <div>
            <span>Stadium section</span>
            <strong>{booking.position || '—'}</strong>
          </div>
          <div>
            <span>Pass type</span>
            <strong>{booking.stand || '—'}</strong>
          </div>
          <div>
            <span>Tickets</span>
            <strong>{ticketCount || '—'}</strong>
          </div>
        </div>
      </div>

      <aside className="ticket-pass-stub">
        <span className="ticket-pass-stub-label">BOOKING CODE</span>
        <strong className="ticket-pass-code">{booking.ticket_code || `BS-${booking.id}`}</strong>
        <div className="ticket-pass-holder">
          <span>PASS HOLDER</span>
          <strong>{booking.name || 'Guest'}</strong>
        </div>
        {total !== null && (
          <div className="ticket-pass-total">
            <span>Booking total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        )}
        <p className="ticket-pass-note">Keep this pass handy for your match day.</p>
      </aside>
    </article>
  )
}

export default TicketPass
