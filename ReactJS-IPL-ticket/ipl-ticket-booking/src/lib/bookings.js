import { supabase } from './supabase'

const HISTORY_TOKENS_KEY = 'ipl-ticket-history-tokens-v1'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Set its URL and publishable key in .env, then restart Vite.')
  }
}

function readHistoryTokens() {
  try {
    const raw = localStorage.getItem(HISTORY_TOKENS_KEY)
    if (!raw) return []

    const tokens = JSON.parse(raw)
    if (!Array.isArray(tokens) || tokens.some((token) => typeof token !== 'string')) {
      throw new Error('Saved booking access tokens are not in the expected format.')
    }

    return tokens
  } catch (error) {
    throw new Error(`Could not read booking history access: ${error.message}`, { cause: error })
  }
}

function storeHistoryToken(token) {
  const tokens = readHistoryTokens()
  if (tokens.includes(token)) return

  try {
    localStorage.setItem(HISTORY_TOKENS_KEY, JSON.stringify([...tokens, token]))
  } catch (error) {
    throw new Error(`Could not save booking history access: ${error.message}`, { cause: error })
  }
}

function createHistoryToken() {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error('This browser cannot create a secure booking access token.')
  }

  return globalThis.crypto.randomUUID()
}

export async function saveBooking(booking) {
  requireSupabase()

  const historyToken = createHistoryToken()
  storeHistoryToken(historyToken)

  const { data, error } = await supabase.rpc('create_guest_booking', {
    p_history_token: historyToken,
    p_name: booking.name,
    p_email: booking.email,
    p_phone: booking.phone || null,
    p_match_id: booking.match_id,
    p_tickets: booking.tickets,
    p_stand: booking.stand,
    p_position: booking.position,
  })

  if (error) {
    if (error.code === 'PGRST202') {
      throw new Error('Supabase booking functions are not installed. Run supabase/guest-bookings.sql in the Supabase SQL Editor.')
    }
    throw new Error(`Could not save booking to Supabase: ${error.message}`)
  }
  if (!data || typeof data !== 'object' || data.history_token !== historyToken) {
    throw new Error('Supabase saved the booking but did not return its history access token.')
  }

  return data
}

export async function getBookingsByVenue(venue = 'all') {
  requireSupabase()

  const historyTokens = readHistoryTokens()
  if (historyTokens.length === 0) return []

  const { data, error } = await supabase.rpc('get_guest_bookings', {
    p_history_tokens: historyTokens,
  })

  if (error) {
    if (error.code === 'PGRST202') {
      throw new Error('Supabase booking functions are not installed. Run supabase/guest-bookings.sql in the Supabase SQL Editor.')
    }
    throw new Error(`Could not load bookings from Supabase: ${error.message}`)
  }
  if (!Array.isArray(data)) {
    throw new Error('Supabase returned booking history in an unexpected format.')
  }

  return venue === 'all'
    ? data
    : data.filter((booking) => booking.venue === venue || booking.place === venue)
}
