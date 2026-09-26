import React, { useState, useEffect } from 'react'
import { db } from '../Firebase'
import { collection, onSnapshot, addDoc } from 'firebase/firestore'

function Rental() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCar, setSelectedCar] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', pickupDate: '', returnDate: '', cardName: '', cardNumber: '', expiry: '', cvv: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cars'), (snapshot) => {
      const data = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(c => c.availableForRent)
      setCars(data)
      setLoading(false)
    }, (err) => {
      console.error('Error loading cars:', err)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const getDays = () => {
    if (!form.pickupDate || !form.returnDate) return 0
    const diff = (new Date(form.returnDate) - new Date(form.pickupDate)) / (1000 * 60 * 60 * 24)
    return diff > 0 ? Math.ceil(diff) : 0
  }

  const days = getDays()
  const total = selectedCar ? days * (selectedCar.rentalPricePerDay || 0) : 0
  const deposit = Math.round(total * 0.2)

  const handleExpiryChange = (e) => {
    let digits = e.target.value.replace(/\D/g, '').slice(0, 4)
    const formatted = digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits
    setForm({ ...form, expiry: formatted })
  }

  const closeModal = () => {
    setSelectedCar(null)
    setSubmitted(false)
    setForm({ name: '', phone: '', email: '', pickupDate: '', returnDate: '', cardName: '', cardNumber: '', expiry: '', cvv: '' })
  }

  const handleReserve = async (e) => {
    e.preventDefault()
    if (days <= 0) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'rentals'), {
        carId: selectedCar.id,
        carName: `${selectedCar.make} ${selectedCar.model} (${selectedCar.year})`,
        name: form.name,
        phone: form.phone,
        email: form.email,
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        days,
        totalCost: total,
        depositPaid: deposit,
        cardLast4: form.cardNumber.slice(-4),
        status: 'Pending Confirmation',
        createdAt: new Date().toISOString()
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Reservation failed:', err)
    }
    setSubmitting(false)
  }

  return (
    <div style={{ background: '#FAF3EF', minHeight: '100vh' }}>

      <div style={{
        position: 'relative', overflow: 'hidden', padding: '56px 32px',
        backgroundColor: '#080808',
        backgroundImage: `radial-gradient(ellipse 900px 600px at 25% 0%, rgba(168,0,11,0.45) 0%, rgba(74,0,4,0.2) 45%, rgba(8,8,8,0) 75%)`
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '600', color: '#F5EDE8', margin: '0 0 10px' }}>Car Rental</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#D8B9B0', margin: '0' }}>Reserve a vehicle with a small deposit — we'll confirm and deliver wherever you are.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#8A6B65', fontFamily: 'Inter, sans-serif' }}>Loading rental fleet...</div>
        ) : cars.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '8px' }}>
            <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '24px', color: '#1F1315', margin: '0 0 10px' }}>Rental fleet coming soon</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B5450', margin: '0' }}>Contact us directly and we'll arrange a rental for you.</p>
          </div>
        ) : (
          <div className="row g-4">
            {cars.map(car => (
              <div key={car.id} className="col-md-6 col-lg-4">
                <div style={{ background: 'white', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(8,8,8,0.08)' }}>
                  <div style={{ height: '180px', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 35%, #A8000B 0%, #4A0004 35%, #080808 80%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {car.images?.[0] ? (
                      <img src={car.images[0]} alt={`${car.make} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '48px', opacity: 0.5 }}>🚗</span>
                    )}
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '17px', fontWeight: '600', color: '#1F1315', margin: '0 0 4px' }}>{car.make} {car.model}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0 0 12px' }}>{car.year} · {car.category}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: '700', color: '#1F1315', margin: '0 0 16px' }}>₦{car.rentalPricePerDay?.toLocaleString()} <span style={{ fontSize: '12px', fontWeight: '400', color: '#6B5450' }}>/ day</span></p>
                    <button onClick={() => setSelectedCar(car)} style={{ width: '100%', background: '#080808', color: '#F5EDE8', padding: '12px', borderRadius: '2px', border: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}>
                      Reserve This Vehicle
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCar && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(8,8,8,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '10px', padding: '32px', maxWidth: '480px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ fontSize: '48px', margin: '0 0 12px' }}>✅</p>
                <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '22px', color: '#1F1315', margin: '0 0 8px' }}>Reservation Requested</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B5450', margin: '0 0 24px' }}>Deposit of ₦{deposit.toLocaleString()} recorded. Our team will confirm delivery details shortly.</p>
                <button onClick={closeModal} style={{ background: '#080808', color: '#F5EDE8', padding: '11px 28px', borderRadius: '2px', border: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleReserve}>
                <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '20px', color: '#1F1315', margin: '0 0 4px' }}>{selectedCar.make} {selectedCar.model}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0 0 20px' }}>₦{selectedCar.rentalPricePerDay?.toLocaleString()} / day</p>

                <div className="row g-2" style={{ marginBottom: '12px' }}>
                  <div className="col-6">
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3A2C29', display: 'block', marginBottom: '4px' }}>Pickup Date</label>
                    <input type="date" required value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                  <div className="col-6">
                    <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#3A2C29', display: 'block', marginBottom: '4px' }}>Return Date</label>
                    <input type="date" required value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '13px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {days > 0 && (
                  <div style={{ background: '#F9EDEA', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px' }}>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#3A2C29', margin: '0 0 4px' }}>{days} day{days > 1 ? 's' : ''} · Total: ₦{total.toLocaleString()}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '700', color: '#1F1315', margin: '0' }}>Deposit due now (20%): ₦{deposit.toLocaleString()}</p>
                  </div>
                )}

                {['name', 'phone', 'email'].map(key => (
                  <input
                    key={key}
                    type={key === 'email' ? 'email' : 'text'}
                    placeholder={key === 'name' ? 'Full Name' : key === 'phone' ? 'Phone Number' : 'Email Address'}
                    required
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' }}
                  />
                ))}

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '700', color: '#1F1315', margin: '16px 0 10px' }}>Deposit Card Details</p>
                <input type="text" placeholder="Cardholder Name" required value={form.cardName} onChange={e => setForm({ ...form, cardName: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' }} />
                <input type="text" placeholder="Card Number" required maxLength="19" value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '10px' }} />
                <div className="row g-2" style={{ marginBottom: '20px' }}>
                  <div className="col-6">
                    <input type="text" placeholder="MM/YY" required maxLength="5" value={form.expiry} onChange={handleExpiryChange} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div className="col-6">
                    <input type="password" placeholder="CVV" required maxLength="3" value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={closeModal} style={{ flex: 1, background: '#F5EDE8', color: '#3A2C29', padding: '12px', borderRadius: '2px', border: '1px solid #E5D9D3', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={submitting || days <= 0} style={{ flex: 2, background: days <= 0 ? '#D1D5DB' : '#080808', color: '#F5EDE8', padding: '12px', borderRadius: '2px', border: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', cursor: days <= 0 ? 'not-allowed' : 'pointer' }}>
                    {submitting ? 'Processing...' : 'Pay Deposit & Reserve'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Rental