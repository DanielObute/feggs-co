import React from 'react'
import logo from '../assets/feggs-logo-transparent.png'

function Footer() {
  return (
    <footer style={{
      position: 'relative', overflow: 'hidden', color: '#F5EDE8', padding: '56px 32px 28px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      backgroundColor: '#080808',
      backgroundImage: `radial-gradient(ellipse 900px 500px at 50% -10%, rgba(168,0,11,0.35) 0%, rgba(74,0,4,0.15) 40%, rgba(8,8,8,0) 75%)`
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row g-4">
          <div className="col-md-4">
            <img src={logo} alt="Feggs & Co" style={{ height: '60px', objectFit: 'contain', marginBottom: '16px', filter: 'brightness(0) invert(1)' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#D8B9B0', lineHeight: '1.7', maxWidth: '320px' }}>
              Driven by Quality. Defined by Excellence. Your next exceptional automobile starts here.
            </p>
          </div>

          <div className="col-md-4">
            <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '13px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E8C9C1', marginBottom: '14px' }}>Contact</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F5EDE8', margin: '0 0 8px' }}>Phone: 09034045154</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F5EDE8', margin: '0 0 8px' }}>WhatsApp: +2349034045154</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F5EDE8', margin: '0 0 8px' }}>feggscoautomotive@gmail.com</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F5EDE8', margin: '0' }}>Instagram & Snapchat: a_fetugs</p>
          </div>

          <div className="col-md-4">
            <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '13px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#E8C9C1', marginBottom: '14px' }}>Business Hours</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F5EDE8', margin: '0 0 8px' }}>Monday – Friday: 8:00am – 5:00pm</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F5EDE8', margin: '0 0 8px' }}>Saturday: 9:00am – 2:00pm</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#F5EDE8', margin: '0' }}>Sunday: Closed</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '40px', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#8A6B65', margin: '0' }}>© 2026 Feggs & Co. All rights reserved.</p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#8A6B65', margin: '0' }}>All car brands available on request</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer