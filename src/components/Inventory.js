import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../Firebase'
import { collection, onSnapshot } from 'firebase/firestore'

function Inventory() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [condition, setCondition] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.availableForSale)
      setCars(data)
      setLoading(false)
    }, (err) => {
      console.error('Error loading cars:', err)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const categories = ['All', ...new Set(cars.map(c => c.category).filter(Boolean))]

  let filtered = cars.filter(c =>
    (category === 'All' || c.category === category) &&
    (condition === 'All' || c.condition === condition)
  )

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0))
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0))
  if (sortBy === 'newest') filtered = [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))

  return (
    <div style={{ background: '#FAF3EF', minHeight: '100vh' }}>

      <div style={{
        position: 'relative', overflow: 'hidden', padding: '56px 32px',
        backgroundColor: '#080808',
        backgroundImage: `radial-gradient(ellipse 900px 600px at 25% 0%, rgba(168,0,11,0.45) 0%, rgba(74,0,4,0.2) 45%, rgba(8,8,8,0) 75%)`
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '600', color: '#F5EDE8', margin: '0 0 10px' }}>Vehicles for Sale</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#D8B9B0', margin: '0' }}>Brand-new and pre-owned vehicles, curated for quality. All car brands available on request.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 32px' }}>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '10px 16px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#1F1315', background: 'white' }}>
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>
          <select value={condition} onChange={e => setCondition(e.target.value)} style={{ padding: '10px 16px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#1F1315', background: 'white' }}>
            <option value="All">All Conditions</option>
            <option value="Brand New">Brand New</option>
            <option value="Pre-Owned">Pre-Owned</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '10px 16px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#1F1315', background: 'white' }}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#8A6B65', fontFamily: 'Inter, sans-serif' }}>Loading inventory...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '8px' }}>
            <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '24px', color: '#1F1315', margin: '0 0 10px' }}>New listings coming soon</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B5450', margin: '0 0 24px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
              Our full inventory of 100 vehicles is being added. In the meantime, reach out and our team will help you find exactly what you're looking for.
            </p>
            <Link to="/contact" style={{ background: '#080808', color: '#F5EDE8', padding: '13px 28px', borderRadius: '2px', textDecoration: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Contact Us
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(car => (
              <div key={car.id} className="col-md-6 col-lg-4">
                <Link to={`/inventory/${car.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'white', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(8,8,8,0.08)' }}>
                    <div style={{ height: '190px', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 35%, #A8000B 0%, #4A0004 35%, #080808 80%)' }}>
                      {car.images?.[0] ? (
                        <img src={car.images[0]} alt={`${car.make} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '52px', opacity: 0.5 }}>🚗</span>
                        </div>
                      )}
                      <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#F5EDE8', color: '#080808', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '3px', fontFamily: 'Inter, sans-serif' }}>{car.condition}</span>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '18px', fontWeight: '600', color: '#1F1315', margin: '0 0 4px' }}>{car.make} {car.model}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0 0 12px' }}>{car.year} · {car.category}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: '700', color: '#1F1315', margin: '0' }}>₦{car.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Inventory