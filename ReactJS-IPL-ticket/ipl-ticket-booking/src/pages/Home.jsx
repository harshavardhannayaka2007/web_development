import cricketHero from '../assets/cricket-hero.svg'
import PageBanner from '../components/PageBanner'

function Home() {
  return (
    <main className="page-shell home-page">
      <PageBanner
        tone="home"
        eyebrow="MATCH DAY STARTS HERE"
        title="Welcome to IPL Ticket Booking"
        description="Book your tickets and enjoy the IPL matches!"
        image={cricketHero}
        imageAlt="Illustration of a cricket ground, wickets, and a cricket ball"
      />
    </main>
  )
}

export default Home
