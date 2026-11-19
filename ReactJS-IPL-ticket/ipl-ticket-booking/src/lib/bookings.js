import { getAuthenticatedUserId, supabase } from './supabase'

const STORAGE_KEY = 'ipl-ticket-bookings-v1'

function readLocalBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const bookings = JSON.parse(raw)
    if (!Array.isArray(bookings)) {
      throw new Error('Stored bookings are not in the expected format.')
    }

    return bookings
  } catch (error) {
    throw new Error(`Could not read local bookings: ${error.message}`, { cause: error })
  }
}

function writeLocalBooking(booking) {
  try {
    const bookings = readLocalBookings()
    localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...bookings]))
  } catch (error) {
    throw new Error(`Could not save the booking: ${error.message}`, { cause: error })
  }
}

export async function saveBooking(booking) {
  if (supabase) {
    const ownerId = await getAuthenticatedUserId()
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        name: booking.name,
        tickets: booking.tickets,
        stand: booking.stand,
        venue: booking.venue,
        place: booking.place,
        owner_id: ownerId,
      })
      .select('id, name, tickets, stand, venue, place, created_at')
      .single()
    if (error) {
      throw new Error(`Could not save booking to Supabase: ${error.message}`)
    }
    return data
  }

  const localBooking = {
    ...booking,
    id: Date.now(),
    created_at: new Date().toISOString(),
  }
  writeLocalBooking(localBooking)
  return localBooking
}

export async function getBookingsByVenue(venue = 'all') {
  if (supabase) {
    const ownerId = await getAuthenticatedUserId()
    let query = supabase
      .from('bookings')
      .select('id, name, tickets, stand, venue, place, created_at')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (venue !== 'all') {
      query = query.eq('venue', venue)
    }

    const { data, error } = await query
    if (error) {
      throw new Error(`Could not load bookings from Supabase: ${error.message}`)
    }
    return data
  }

  const bookings = readLocalBookings()
  return venue === 'all' ? bookings : bookings.filter((booking) => booking.venue === venue)
}
