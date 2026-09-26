import React, { useState } from 'react'
import { db } from '../Firebase'
import { collection, addDoc } from 'firebase/firestore'

function Servicing() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', vehicleMake: '', vehicleYear: '', serviceType: 'General Service', preferredDate: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'serviceBookings'), {
        ...form,
        status: 'Pending',
        createdAt: new Date().toISOString()
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Service booking failed:', err)
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
          <h1 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '600', color: '#F5EDE8', margin: '0 0 10px' }}>Servicing & Inspection</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#D8B9B0', margin: '0', maxWidth: '600px' }}>Professional inspection and maintenance for your vehicle, handled with the same standard we apply to every car that carries the Feggs & Co name.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 32px' }}>
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div style={{ background: 'white', borderRadius: '8px', padding: '36px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <p style={{ fontSize: '48px', margin: '0 0 12px' }}>✅</p>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '24px', color: '#1F1315', margin: '0 0 10px' }}>Booking Received</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B5450', margin: '0' }}>Our team will call or WhatsApp you to confirm your appointment time.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '20px', color: '#1F1315', margin: '0 0 24px' }}>Book a Service Appointment</p>

                  <div className="row g-3" style={{ marginBottom: '4px' }}>
                    <div className="col-md-6">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Full Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                      <input type="text" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Email Address</label>
                      <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Preferred Date</label>
                      <input type="date" required value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Vehicle Make & Model</label>
                      <input type="text" placeholder="e.g. Toyota Camry" required value={form.vehicleMake} onChange={e => setForm({ ...form, vehicleMake: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Vehicle Year</label>
                      <input type="text" placeholder="e.g. 2020" required value={form.vehicleYear} onChange={e => setForm({ ...form, vehicleYear: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div className="col-12">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Service Type</label>
                      <select value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}>
                        <option>General Service</option>
                        <option>Full Inspection</option>
                        <option>Repair</option>
                        <option>Detailing</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Additional Notes (optional)</label>
                      <textarea rows="3" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} style={{ width: '100%', marginTop: '24px', background: '#080808', color: '#F5EDE8', padding: '14px', borderRadius: '2px', border: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? 'Booking...' : 'Book Appointment'}
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

export default Servicing