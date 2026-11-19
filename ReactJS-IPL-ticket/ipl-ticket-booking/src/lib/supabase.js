import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (Boolean(supabaseUrl) !== Boolean(supabaseKey)) {
  throw new Error(
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file.',
  )
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      })
    : null

export async function getAuthenticatedUserId() {
  if (!supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) {
    throw new Error(`Could not load the booking session: ${error.message}`)
  }

  const user = data.session?.user
  if (!user || user.is_anonymous) {
    throw new Error('Sign in with a registered account before booking.')
  }

  return user.id
}
