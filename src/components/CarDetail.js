import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { db } from '../Firebase'
import { doc, getDoc, addDoc, collection } from 'firebase/firestore'

function CarDetail() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const snap = await getDoc(doc(db, 'cars', id))
        if (snap.exists()) setCar({ id: snap.id, ...snap.data() })
      } catch (err) {
        console.error('Error fetching car:', err)
      }
      setLoading(false)
    }
    fetchCar()
  }, [id])

  const handleEnquiry = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await addDoc(collection(db, 'enquiries'), {
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        carId: car.id,
        carName: `${car.make} ${car.model} (${car.year})`,
        type: 'Purchase Enquiry',
        status: 'New',
        createdAt: new Date().toISOString()
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Enquiry failed:', err)
      setError('Something went wrong sending your enquiry. Please try again or contact us directly.')
    }

    setSubmitting(false)
  }

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#8A6B65' }}>Loading...</div>
  }

  if (!car) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAF3EF', padding: '40px' }}>
        <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '26px', color: '#1F1315', margin: '0 0 10px' }}>Vehicle not found</p>
        <Link to="/inventory" style={{ fontFamily: 'Inter, sans-serif', color: '#6B5450', fontSize: '14px' }}>← Back to Inventory</Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#FAF3EF', minHeight: '100vh' }}>

      <div className="container" style={{ padding: '32px 32px 0' }}>
        <Link to="/inventory" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', textDecoration: 'none' }}>← Back to Inventory</Link>
      </div>

      {/* FULL-WIDTH IMAGE — object-fit: contain so the whole car is always visible, never cropped */}
      <div className="container" style={{ padding: '20px 32px 0' }}>
        <div style={{
          width: '100%',
          maxHeight: '75vh',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: car.images?.length > 1 ? '12px' : '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: car.images?.[activeImage] ? 'transparent' : 'radial-gradient(ellipse at 50% 40%, #4A0004 0%, #14000a 70%, #080808 100%)'
       }}>
        {car.images?.[activeImage] ? (
          <img
          src={car.images[activeImage]}
          alt={`${car.make} ${car.model}`}
          style={{ width: '100%', height: 'auto', maxHeight: '75vh', display: 'block', objectFit: 'contain' }}
        />
      ) : (
        <span style={{ fontSize: '90px', opacity: 0.5, padding: '120px 0' }}>🚗</span>
      )}
    </div>

        {car.images?.length > 1 && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {car.images.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                onClick={() => setActiveImage(i)}
                style={{ width: '76px', height: '76px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', border: activeImage === i ? '2px solid #A8000B' : '2px solid transparent', opacity: activeImage === i ? 1 : 0.6 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container" style={{ padding: '0 32px 48px' }}>
        <div className="row g-5">
          <div className="col-lg-7">
            <h1 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '32px', fontWeight: '600', color: '#1F1315', margin: '0 0 8px' }}>{car.make} {car.model}</h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#6B5450', margin: '0 0 24px' }}>{car.year} · {car.condition}</p>

            <div className="row g-3" style={{ marginBottom: '28px' }}>
              {[
                { label: 'Mileage', value: car.mileage ? `${car.mileage.toLocaleString()} km` : '—' },
                { label: 'Transmission', value: car.transmission || '—' },
                { label: 'Fuel Type', value: car.fuelType || '—' },
                { label: 'Category', value: car.category || '—' },
              ].map((s, i) => (
                <div key={i} className="col-6 col-md-3">
                  <div style={{ background: 'white', borderRadius: '6px', padding: '14px' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#9CA3AF', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '700', color: '#1F1315', margin: '0' }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {car.description && (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#3A2C29', lineHeight: '1.8' }}>{car.description}</p>
            )}

            {car.availableForRent && (
              <div style={{ background: '#F9EDEA', borderRadius: '6px', padding: '16px 20px', marginTop: '16px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#1F1315', margin: '0' }}>
                  This vehicle is also available for rent. <Link to="/rental" style={{ color: '#A8000B', fontWeight: '700' }}>Reserve it here →</Link>
                </p>
              </div>
            )}
          </div>

          <div className="col-lg-5">
            <div style={{ background: 'white', borderRadius: '8px', padding: '32px', position: 'sticky', top: '96px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0 0 4px' }}>Price</p>
              <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '30px', fontWeight: '600', color: '#1F1315', margin: '0 0 24px' }}>₦{car.price?.toLocaleString()}</p>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: '40px', margin: '0 0 12px' }}>✅</p>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '18px', color: '#1F1315', margin: '0 0 8px' }}>Enquiry sent</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0' }}>Our team will reach out shortly to discuss this vehicle.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquiry}>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '14px', fontWeight: '700', color: '#1F1315', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Enquire About This Vehicle</p>

                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
                  />
                  <textarea
                    placeholder="Message (optional)"
                    rows="3"
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px', resize: 'vertical' }}
                  />

                  {error && (
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#A8000B', margin: '0 0 12px' }}>{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ width: '100%', background: '#080808', color: '#F5EDE8', padding: '13px', borderRadius: '2px', border: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer' }}
                  >
                    {submitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetail