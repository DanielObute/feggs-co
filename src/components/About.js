import React from 'react'
import { Link } from 'react-router-dom'

const offerings = [
  'Premium vehicle sales', 'Luxury & executive automobiles', 'SUVs and family vehicles',
  'Brand-new & pre-owned vehicles', 'Vehicle sourcing', 'Vehicle importation',
  'Vehicle trade-ins', 'Vehicle inspection', 'Documentation assistance',
  'Nationwide delivery', 'Corporate & fleet vehicle solutions'
]

const whyUs = [
  { title: 'Quality Without Compromise', body: 'Every vehicle meets a standard worthy of the Feggs & Co name.' },
  { title: 'Curated Selection', body: 'We focus on desirable vehicles that combine style, performance, comfort, reliability and value.' },
  { title: 'Transparent Dealings', body: 'Our goal is to make every transaction clear, professional and confidence-inspiring.' },
  { title: 'Premium Customer Experience', body: 'From the first enquiry to vehicle delivery, clients receive personalized assistance and professional attention.' },
  { title: 'Nationwide Service', body: 'Wherever our clients are located, we aim to make acquiring their next vehicle as seamless as possible.' },
]

function About() {
  return (
    <div style={{ background: '#FAF3EF' }}>

      {/* Hero — now matches the homepage's crimson spotlight instead of the old sky blue */}
      <div style={{
        position: 'relative', overflow: 'hidden', padding: '80px 32px',
        backgroundColor: '#080808',
        backgroundImage: `radial-gradient(ellipse 1100px 700px at 30% 10%, rgba(168,0,11,0.5) 0%, rgba(74,0,4,0.22) 45%, rgba(8,8,8,0) 78%)`
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '13px', fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', color: '#E8C9C1', margin: '0 0 16px' }}>Automotive Sales & Services · Since 2018</p>
          <h1 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: '600', color: '#F5EDE8', margin: '0 0 20px', maxWidth: '700px' }}>
            Quality should never be compromised.
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'rgba(245,237,232,0.85)', lineHeight: '1.8', maxWidth: '640px', margin: '0' }}>
            Feggs & Co is a premium automotive brand built around a simple philosophy: quality should never be compromised. We specialize in connecting discerning clients with exceptional automobiles, combining carefully selected vehicles, professional service, transparent transactions, and a customer experience designed to feel as premium as the cars themselves.
          </p>
        </div>
      </div>

      {/* Brand at a glance */}
      <div style={{
        position: 'relative', overflow: 'hidden', padding: '48px 32px',
        backgroundColor: '#080808',
        backgroundImage: `radial-gradient(ellipse 900px 500px at 70% 100%, rgba(168,0,11,0.3) 0%, rgba(74,0,4,0.12) 50%, rgba(8,8,8,0) 78%)`
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '22px', color: '#F5EDE8', margin: '0 0 28px' }}>Our Brand at a Glance</h2>
          <div className="row g-4">
            {[
              ['Founded', '2018'],
              ['Vehicles Sold', '1,000+'],
              ['Current Inventory', '100 Vehicles'],
              ['Primary Market', 'Nigeria'],
              ['Showroom', '10 vehicles on display'],
              ['On the Lot', '40+ additional vehicles'],
              ['Delivery', 'Nationwide'],
            ].map(([label, value], i) => (
              <div key={i} className="col-6 col-md-3">
                <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '22px', fontWeight: '600', color: '#F5EDE8', margin: '0 0 4px' }}>{value}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#D8B9B0', margin: '0' }}>{label}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#D8B9B0', marginTop: '28px', lineHeight: '1.7', maxWidth: '640px' }}>
            Customers can walk around our showroom, compare vehicles, talk to salespeople and arrange test drives — or have a vehicle delivered anywhere in the country.
          </p>
        </div>
      </div>

      {/* What we offer */}
      <div style={{ padding: '72px 32px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: '600', color: '#1F1315', margin: '0 0 32px' }}>What We Offer</h2>
          <div className="row g-3">
            {offerings.map((item, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div style={{ background: 'white', borderRadius: '6px', padding: '16px 20px', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#3A2C29', borderLeft: '3px solid #A8000B' }}>
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why us */}
      <div style={{ background: '#F3E5DF', padding: '72px 32px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: '600', color: '#1F1315', margin: '0 0 32px' }}>Why Feggs & Co</h2>
          <div className="row g-4">
            {whyUs.map((item, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div style={{ background: 'white', borderRadius: '6px', padding: '24px' }}>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '18px', fontWeight: '600', color: '#1F1315', margin: '0 0 8px' }}>{item.title}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B5450', lineHeight: '1.6', margin: '0' }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promise / CTA */}
      <div style={{
        position: 'relative', overflow: 'hidden', padding: '72px 32px', textAlign: 'center',
        backgroundColor: '#080808',
        backgroundImage: `radial-gradient(ellipse 1000px 700px at 50% 50%, rgba(168,0,11,0.4) 0%, rgba(74,0,4,0.18) 50%, rgba(8,8,8,0) 80%)`
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'Bodoni Moda, serif', fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 30px)', color: '#F5EDE8', margin: '0 0 16px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
            A vehicle purchase shouldn't feel like an ordinary transaction. It should feel like an upgrade.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#D8B9B0', margin: '0 0 28px' }}>
            Driven by Quality. Defined by Excellence.
          </p>
          <Link to="/contact" style={{ background: '#F5EDE8', color: '#080808', padding: '14px 32px', borderRadius: '2px', textDecoration: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Get in Touch
          </Link>
        </div>
      </div>

    </div>
  )
}

export default About