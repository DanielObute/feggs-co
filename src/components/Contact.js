import React, { useState } from 'react'
import { db } from '../Firebase'
import { collection, addDoc } from 'firebase/firestore'

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'General Enquiry', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'enquiries'), {
        ...form,
        type: form.subject,
        status: 'New',
        createdAt: new Date().toISOString()
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Contact form failed:', err)
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
          <h1 style={{ fontFamily: 'Bodoni Moda, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '600', color: '#F5EDE8', margin: '0 0 10px' }}>Contact Us</h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#D8B9B0', margin: '0' }}>Reach out and our team will get back to you shortly.</p>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 32px' }}>
        <div className="row g-5">

          <div className="col-lg-5">
            <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '22px', color: '#1F1315', margin: '0 0 24px' }}>Get in Touch</p>

            {[
              { label: 'Phone', value: '09034045154' },
              { label: 'WhatsApp', value: '+2349034045154' },
              { label: 'Email', value: 'feggscoautomotive@gmail.com' },
              { label: 'Instagram & Snapchat', value: 'a_fetugs' },
              { label: 'Showroom Address', value: 'Available upon enquiry' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '18px' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#9CA3AF', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '600', color: '#1F1315', margin: '0' }}>{item.value}</p>
              </div>
            ))}

            <div style={{ background: 'white', borderRadius: '6px', padding: '20px', marginTop: '28px' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '700', color: '#1F1315', margin: '0 0 10px' }}>Business Hours</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0 0 4px' }}>Monday – Friday: 8:00am – 5:00pm</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0 0 4px' }}>Saturday: 9:00am – 2:00pm</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B5450', margin: '0' }}>Sunday: Closed</p>
            </div>
          </div>

          <div className="col-lg-7">
            <div style={{ background: 'white', borderRadius: '8px', padding: '32px' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <p style={{ fontSize: '48px', margin: '0 0 12px' }}>✅</p>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '22px', color: '#1F1315', margin: '0 0 8px' }}>Message Sent</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#6B5450', margin: '0' }}>Thanks for reaching out — our team will respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
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
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Subject</label>
                      <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', background: 'white' }}>
                        <option>General Enquiry</option>
                        <option>Vehicle Sourcing</option>
                        <option>Vehicle Importation</option>
                        <option>Trade-In</option>
                        <option>Corporate & Fleet</option>
                        <option>Documentation Assistance</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#3A2C29', display: 'block', marginBottom: '6px' }}>Message</label>
                      <textarea rows="5" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ width: '100%', padding: '11px 14px', borderRadius: '4px', border: '1.5px solid #E5D9D3', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>

                  <button type="submit" disabled={submitting} style={{ width: '100%', marginTop: '20px', background: '#080808', color: '#F5EDE8', padding: '14px', borderRadius: '2px', border: 'none', fontFamily: 'Bodoni Moda, serif', fontWeight: '600', fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer' }}>
                    {submitting ? 'Sending...' : 'Send Message'}
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

export default Contact