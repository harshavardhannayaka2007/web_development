export const standPrices = {
  'General Stand': 500,
  'VIP Stand': 1500,
}

export const matches = [
  {
    id: 'rcb-csk',
    team1: 'RCB',
    team2: 'CSK',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    venueOption: 'M. Chinnaswamy Stadium',
    date: '25 March 2026',
  },
  {
    id: 'mi-kkr',
    team1: 'MI',
    team2: 'KKR',
    venue: 'Wankhede Stadium, Mumbai',
    venueOption: 'Wankhede Stadium',
    date: '28 March 2026',
  },
]

export const stadiumSections = [
  'Section A · Lower tier',
  'Section B · Mid tier',
  'Section C · Upper tier',
  'Section D · Corner view',
]

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
