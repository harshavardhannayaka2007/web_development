# IPL Match Tickets

A four-page cricket ticket-booking demo with Home, Matches, Booking, and Booking History. Customers do not need an account.

## Run locally

```sh
npm install
npm run dev
```

## Connect Supabase

The app uses the Supabase project URL and publishable key from `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never put a Supabase `service_role` or secret key in a Vite environment variable.

In the Supabase SQL Editor:

1. If all rows in `public.bookings` are disposable trial data, run `supabase/clear-booking-trial-data.sql` **once**. It deletes rows but retains the table. Verify the result is zero before continuing.
2. Run `supabase/guest-bookings.sql` to add booking columns and create the guest-booking functions. The table has row-level security enabled and direct table access is revoked from browser roles.
3. Restart the Vite server.

The browser calls the database functions to create a booking and retrieve only bookings associated with high-entropy access tokens saved in that browser. Booking history therefore appears on the browser where each booking was made; there is no account-based or cross-device history.

## Demo limitations

The colour-coded pass and booking code are for demonstration. The app does not take payment, send email/SMS, check live seat availability, or verify venue entry. Fixture dates and stadium sections in `src/data/matches.js` are examples, not official schedules or live seat maps.
