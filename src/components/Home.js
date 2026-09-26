import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../Firebase'
import { collection, onSnapshot } from 'firebase/firestore'

import ferrariImage from '../assets/ferrari-purosangue-home.webp'
// Update 'new-rolls-royce.jpg' to exactly match your file's name
import newRollsRoyceImage from '../assets/new-rolls-royce.jpg' 

const heroSlides = [
  {
    make: 'Ferrari',
    model: 'Purosangue',
    images: [ferrariImage],
  },
  {
    make: 'Rolls-Royce',
    model: 'Phantom', // Update this to the correct model if needed
    images: [newRollsRoyceImage],
  }
]

const stats = [
  { label: 'Founded', value: '2018' },
  { label: 'Vehicles Sold', value: '1,000+' },
  { label: 'Current Inventory', value: '100' },
  { label: 'Delivery', value: 'Nationwide' },
]

const whyUs = [
  { title: 'Quality Without Compromise', body: 'Every vehicle meets a standard worthy of the Feggs & Co name.' },
  { title: 'Curated Selection', body: 'We focus on desirable vehicles that combine style, performance, comfort, reliability and value.' },
  { title: 'Transparent Dealings', body: 'Our goal is to make every transaction clear, professional and confidence-inspiring.' },
  { title: 'Premium Customer Experience', body: 'From the first enquiry to vehicle delivery, clients receive personalized assistance and professional attention.' },
]

const services = [
  { title: 'Buy a Vehicle', body: 'New & pre-owned luxury cars, SUVs and executive automobiles.', link: '/inventory' },
  { title: 'Rent a Vehicle', body: 'Short and long-term rental, delivered wherever you are.', link: '/rental' },
  { title: 'Servicing & Inspection', body: 'Professional inspection and maintenance for your vehicle.', link: '/servicing' },
  { title: 'Concierge Services', body: 'Sourcing, importation, trade-ins, documentation, fleet solutions.', link: '/contact' },
]

// Reusable Ferrari-style "spotlight" background component
function SpotlightBackground({ children, style }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#080808',
      backgroundImage: `
        radial-gradient(
          ellipse 75% 65% at 50% 35%, 
          rgba(168, 0, 11, 0.65) 0%, 
          rgba(74, 0, 4, 0.4) 35%, 
          rgba(20, 0, 3, 0.2) 60%, 
          rgba(8, 8, 8, 0) 85%
        )
      `,
      ...style
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        pointerEvents: 'none'
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

function Home() {
  const [cars, setCars] = useState([])
  const [activeSlide, setActiveSlide] = useState(0)

  // Firebase listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      setCars(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    }, (err) => console.error('Error loading cars for homepage:', err))
    return () => unsubscribe()
  }, [])

  const slideCount = heroSlides.length || 1

  // Auto-slide timer
  useEffect(() => {
    const timer = setInterval(() => {
     setActiveSlide(prev => (prev + 1) % slideCount)
    }, 6000)
    return () => clearInterval(timer)
  }, [slideCount])

  const goToSlide = (i) => setActiveSlide(i)
  const prevSlide = () => setActiveSlide(prev => (prev - 1 + slideCount) % slideCount)
  const nextSlide = () => setActiveSlide(prev => (prev + 1) % slideCount)

  return (
    <div style={{ background: '#FAF3EF' }}>

      <style>{`
        @keyframes feggs-driveaway {
          from { transform: scale(1) translateX(0); }
          to { transform: scale(1.03) translateX(-4%); }
        }
        .feggs-hero-driveaway {
          animation: feggs-driveaway 6.4s ease-in-out forwards;
        }
      `}</style>

      {/* FULL-SCREEN HERO SLIDESHOW */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', minHeight: '560px', overflow: 'hidden', background: '#080808' }}>

        {heroSlides.map((car, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', inset: 0,
              opacity: activeSlide === i ? 1 : 0,
              transition: 'opacity 1.4s ease',
              zIndex: activeSlide === i ? 2 : 1,
            }}
          >
            {car.images?.[0] ? (
              <img
                src={car.images[0]}
                alt={`${car.make} ${car.model}`}
                className={activeSlide === i ? 'feggs-hero-driveaway' : ''}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                background: 'radial-gradient(ellipse 100% 48% at 50% 0%, #A8000B 0%, #4A0004 55%, #080808 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <span style={{ fontSize: '140px', opacity: 0.25 }}>🚗</span>
              </div>
            )}

            {/* Crimson glow */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'radial-gradient(ellipse 100% 48% at 50% 0%, rgba(168,0,11,0.62) 0%, rgba(74,0,4,0.32) 55%, rgba(8,8,8,0) 100%)' 
            }} />

            {/* Dark scrim */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.08) 22%, rgba(8,8,8,0.15) 45%, rgba(8,8,8,0.6) 60%, rgba(8,8,8,0.93) 75%, #080808 100%)' }} />
          </div>
        ))}

        <div style={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div className="container">
            <div style={{ maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
              <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '13px', fontWeight: '500', letterSpacing: '3px', textTransform: 'uppercase', color: '#E8C9C1', margin: '0 0 16px' }}>Feggs & Co — Automotive Sales & Services</p>
              <h1 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(38px, 5.5vw, 62px)', fontWeight: '600', color: '#FFFFFF', lineHeight: '1.1', margin: '0 0 20px' }}>
                Premium Automobiles.<br /><span style={{ fontStyle: 'italic', color: '#F5EDE8' }}>Exceptional Standards.</span>
              </h1>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'rgba(245,237,232,0.85)', lineHeight: '1.7', margin: '0 auto 32px', maxWidth: '540px' }}>
                We connect discerning clients with exceptional automobiles — carefully selected vehicles, professional service and a customer experience designed to feel as premium as the cars themselves.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/inventory" style={{ background: '#F5EDE8', color: '#080808', padding: '15px 30px', borderRadius: '2px', textDecoration: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Browse Inventory
                </Link>
                <Link to="/contact" style={{ background: 'transparent', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.5)', padding: '15px 30px', borderRadius: '2px', textDecoration: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                  Book a Test Drive
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic slide dots based on array length */}
        {slideCount > 1 && (
          <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', gap: '10px' }}>
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                style={{
                  width: activeSlide === i ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeSlide === i ? '#F5EDE8' : 'rgba(255,255,255,0.35)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
              />
            ))}
          </div>
        )}

        {/* Hide arrows if there's only 1 slide */}
        {slideCount > 1 && (
          <>
            <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 4, background: 'rgba(245,237,232,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>‹</button>
            <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 4, background: 'rgba(245,237,232,0.1)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', width: '44px', height: '44px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>›</button>
          </>
        )}
      </div>

      {/* STATS STRIP */}
      <SpotlightBackground style={{ padding: '40px 32px' }}>
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '32px', fontWeight: '600', color: '#FFFFFF', margin: '0 0 4px' }}>{s.value}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#E8C9C1', margin: '0' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </SpotlightBackground>

      {/* WHY FEGGS & CO */}
      <div style={{ padding: '80px 32px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: '600', color: '#1F1315', margin: '0 0 12px' }}>Why Feggs & Co</h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#6B5450', margin: '0 0 48px', maxWidth: '560px' }}>
            At Feggs & Co, we don't believe a vehicle purchase should feel like an ordinary transaction. It should feel like an upgrade.
          </p>
          <div className="row g-4">
            {whyUs.map((item, i) => (
              <div key={i} className="col-md-6">
                <div style={{ padding: '28px', background: 'white', borderLeft: '3px solid #A8000B', borderRadius: '2px' }}>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '19px', fontWeight: '600', color: '#1F1315', margin: '0 0 8px' }}>{item.title}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B5450', lineHeight: '1.6', margin: '0' }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <SpotlightBackground style={{ padding: '80px 32px' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: '600', color: '#FFFFFF', margin: '0 0 40px' }}>What We Offer</h2>
          <div className="row g-4">
            {services.map((s, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <Link to={s.link} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '28px 24px', height: '100%', transition: 'all 0.2s ease' }}>
                    <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '18px', fontWeight: '600', color: '#FFFFFF', margin: '0 0 10px' }}>{s.title}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#D8B9B0', lineHeight: '1.6', margin: '0 0 16px' }}>{s.body}</p>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '700', color: '#E8C9C1' }}>Learn more →</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </SpotlightBackground>

      {/* CTA BANNER */}
      <SpotlightBackground style={{ padding: '64px 32px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(24px, 3vw, 34px)', fontStyle: 'italic', color: '#FFFFFF', margin: '0 0 24px' }}>
          Your next exceptional automobile starts here.
        </p>
        <Link to="/contact" style={{ background: '#F5EDE8', color: '#080808', padding: '15px 32px', borderRadius: '2px', textDecoration: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Enquire Now
        </Link>
      </SpotlightBackground>

    </div>
  )
}

export default Home