import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/feggs-logo-navbar.png'

const links = [
  { path: '/inventory', label: 'Buy' },
  { path: '/rental', label: 'Rent' },
  { path: '/servicing', label: 'Service' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      backgroundColor: '#080808',
      backgroundImage: 'radial-gradient(ellipse 900px 400px at 50% -60%, rgba(168,0,11,0.55) 0%, rgba(74,0,4,0.28) 45%, rgba(8,8,8,0) 85%)',
      padding: '0 32px', height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 24px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)'
    }}>
      <NavLink to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Feggs & Co" style={{ height: '42px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
     </NavLink>

      <div className="d-none d-md-flex" style={{ alignItems: 'center', gap: '6px' }}>
        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              padding: '10px 18px',
              fontFamily: 'Bodoni Moda, serif',
              fontSize: '14px',
              fontWeight: '500',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: '#FFFFFF',
              borderBottom: isActive ? '1px solid #A8000B' : '1px solid transparent',
              transition: 'color 0.2s'
            })}
          >
            {link.label}
          </NavLink>
        ))}
        <NavLink
          to="/contact"
          style={{ marginLeft: '16px', background: '#F5EDE8', color: '#080808', padding: '11px 24px', borderRadius: '2px', fontFamily: 'Bodoni Moda, serif', fontSize: '13px', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          Book a Test Drive
        </NavLink>
      </div>

      <button
        className="d-md-none"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ background: 'none', border: 'none', color: '#F5EDE8', fontSize: '26px', cursor: 'pointer', padding: '4px 8px' }}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div className="d-md-none" style={{ position: 'absolute', top: '76px', left: 0, right: 0, background: '#080808', padding: '12px 24px 24px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {links.map(link => (
            <NavLink
              key={link.path}
              onClick={() => setMenuOpen(false)}
              to={link.path}
              style={({ isActive }) => ({
                padding: '14px 8px',
                fontFamily: 'Bodoni Moda, serif',
                fontSize: '15px',
                fontWeight: '500',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: '#FFFFFF',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar