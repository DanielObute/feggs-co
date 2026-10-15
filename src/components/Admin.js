import React, { useState, useEffect } from 'react'
import { db, auth } from '../Firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

const emptyCarForm = {
    make: '', model: '', year: '', price: '', category: 'SUV', condition: 'Brand New',
    mileage: '', transmission: 'Automatic', fuelType: 'Petrol', description: '',
    availableForSale: true, availableForRent: false, rentalPricePerDay: '',
    images: []
  }

function Admin() {
const uploadImageToCloudinary = async (file) => {
        if (!file) return null
    
        const formData = new FormData()
    
        formData.append('file', file)
        formData.append('upload_preset', 'feggs_cars')
    
        try {
          const response = await fetch(
            'https://api.cloudinary.com/v1_1/qdn2glgh/image/upload',
            {
              method: 'POST',
              body: formData,
            }
          )
    
          const data = await response.json()
          console.log('Cloudinary response:', data)

          if (!response.ok || !data.secure_url) {
            console.error('Cloudinary upload error:', data)
            alert('Image upload failed.')
            return null
          }
    
          return data.secure_url
        } catch (error) {
          console.error('Cloudinary upload error:', error)
          alert('Something went wrong while uploading the image.')
          return null
        }
      }
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const [cars, setCars] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [rentals, setRentals] = useState([])
  const [serviceBookings, setServiceBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const [carForm, setCarForm] = useState(emptyCarForm)
  const [uploadingImages, setUploadingImages] = useState(false)

  const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files || [])
  if (!files.length) return

  setUploadingImages(true)

  const uploadedUrls = []

   for (const file of files) {
    const url = await uploadImageToCloudinary(file)

    if (url) {
      uploadedUrls.push(url)
    }
  }


  console.log('Uploaded URLs:', uploadedUrls)
  setCarForm(prev => {
    const updatedForm = {
      ...prev,
      images: [...(prev.images || []), ...uploadedUrls]
    }
  
    console.log('Updated carForm:', updatedForm)
  
    return updatedForm
  })

  setUploadingImages(false)

  e.target.value = ''
}


  const [editingCarId, setEditingCarId] = useState(null)
  const [showCarForm, setShowCarForm] = useState(false)


  const ADMIN_UID = '3Ipq5JAA3DO1kfYVq2AeDwsqaG02'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.uid === ADMIN_UID)
      setAuthLoading(false)
  
      if (user && user.uid !== ADMIN_UID) {
        signOut(auth).catch(console.error)
      }
    })
  
    return unsubscribe
  }, [])
  
  useEffect(() => {
    if (!isAdmin) return
    const unsub1 = onSnapshot(collection(db, 'cars'), s => setCars(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    const unsub2 = onSnapshot(collection(db, 'enquiries'), s => setEnquiries(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    const unsub3 = onSnapshot(collection(db, 'rentals'), s => setRentals(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    const unsub4 = onSnapshot(collection(db, 'serviceBookings'), s => { setServiceBookings(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoading(false) })
    return () => { unsub1(); unsub2(); unsub3(); unsub4() }
  }, [isAdmin])

 
const handleLogin = async (e) => {
  e.preventDefault()
  setLoginError('')

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    )

    console.log('Firebase login succeeded. UID:', result.user.uid)
    console.log('Expected admin UID:', ADMIN_UID)

    setPassword('')
  } catch (error) {
    console.error('Firebase login failed:', error.code, error.message)
    setLoginError(`Login failed: ${error.code || error.message}`)
  }
}
    
    const confirmLogout = async () => {
    try {
    await signOut(auth)
    setShowLogoutConfirm(false)
    setPassword('')
    setEmail('')
    } catch (error) {
    console.error('Admin logout error:', error)
    setLoginError('Logout failed. Please try again.')
    }
    }


  const openAddCar = () => {
    setCarForm(emptyCarForm)
    setEditingCarId(null)
    setShowCarForm(true)
  }

  const openEditCar = (car) => {
    setCarForm({ ...emptyCarForm, ...car })
    setEditingCarId(car.id)
    setShowCarForm(true)
  }

  const handleSaveCar = async (e) => {
    e.preventDefault()
    const payload = {
      ...carForm,
      year: parseInt(carForm.year) || 0,
      price: parseFloat(carForm.price) || 0,
      mileage: parseFloat(carForm.mileage) || 0,
      rentalPricePerDay: parseFloat(carForm.rentalPricePerDay) || 0,
    }
    console.log('Saving vehicle payload:', payload)
    try {
      if (editingCarId) {
        await updateDoc(doc(db, 'cars', editingCarId), payload)
      } else {
        await addDoc(collection(db, 'cars'), { ...payload, createdAt: new Date().toISOString() })
      }
      setShowCarForm(false)
    } catch (err) {
      console.error('Error saving car:', err)
    }
  }

  const handleDeleteCar = async (id) => {
    if (window.confirm('Delete this vehicle from inventory?')) {
      await deleteDoc(doc(db, 'cars', id))
    }
  }

  const updateStatus = async (collectionName, id, status) => {
    await updateDoc(doc(db, collectionName, id), { status })
  }

  if (authLoading) {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      Checking admin session...
    </div>
  )
}
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#17181C', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', borderRadius: '10px', padding: '40px', width: '100%', maxWidth: '380px' }}>
          <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '24px', color: '#1F2937', margin: '0 0 4px' }}>Feggs & Co</p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', margin: '0 0 24px' }}>Admin Access</p>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => {
              setEmail(e.target.value)
              setLoginError('')
            }}
            required
            autoComplete="username"
            style={{ width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1.5px solid #E5E7EB', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setLoginError('') }}
            style={{ width: '100%', padding: '12px 14px', borderRadius: '4px', border: '1.5px solid #E5E7EB', fontFamily: 'Inter, sans-serif', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' }}
          />
          {loginError && <p style={{ color: '#DC2626', fontFamily: 'Inter, sans-serif', fontSize: '13px', margin: '0 0 12px' }}>{loginError}</p>}
          <button type="submit" style={{ width: '100%', background: '#17181C', color: '#F5F1E6', padding: '13px', borderRadius: '4px', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
            Access Dashboard
          </button>
        </form>
      </div>
    )
  }

  const totalEnquiries = enquiries.length
  const newEnquiries = enquiries.filter(e => e.status === 'New').length
  const pendingRentals = rentals.filter(r => r.status === 'Pending Confirmation').length
  const pendingServices = serviceBookings.filter(s => s.status === 'Pending').length

  return (
    <div style={{ background: '#F0F0EC', minHeight: '100vh' }}>

      <nav style={{ background: '#17181C', padding: '0 24px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '18px', color: '#F5F1E6', margin: '0' }}>Feggs & Co — Admin</p>
        <button onClick={() => setShowLogoutConfirm(true)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600' }}>Logout</button>
      </nav>

      <div style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'white', padding: '6px', borderRadius: '8px', width: 'fit-content', flexWrap: 'wrap' }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'cars', label: 'Inventory' },
            { key: 'enquiries', label: `Enquiries${newEnquiries ? ` (${newEnquiries})` : ''}` },
            { key: 'rentals', label: `Rentals${pendingRentals ? ` (${pendingRentals})` : ''}` },
            { key: 'servicing', label: `Servicing${pendingServices ? ` (${pendingServices})` : ''}` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '9px 18px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: '600', fontSize: '13px', background: activeTab === tab.key ? '#17181C' : 'transparent', color: activeTab === tab.key ? 'white' : '#5A6472' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="row g-3">
            {[
              { label: 'Total Vehicles', value: cars.length },
              { label: 'New Enquiries', value: newEnquiries },
              { label: 'Pending Rentals', value: pendingRentals },
              { label: 'Pending Service Bookings', value: pendingServices },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div style={{ background: 'white', borderRadius: '8px', padding: '22px' }}>
                  <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '28px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px' }}>{s.value}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', margin: '0' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CARS / INVENTORY */}
        {activeTab === 'cars' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '20px', color: '#1F2937', margin: '0' }}>{cars.length} Vehicles</p>
              <button onClick={openAddCar} style={{ background: '#17181C', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>+ Add Vehicle</button>
            </div>

            <div className="row g-3">
              {cars.map(car => (
                <div key={car.id} className="col-md-6 col-lg-4">
                  <div style={{ background: 'white', borderRadius: '8px', padding: '18px' }}>
                    <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px' }}>{car.make} {car.model} ({car.year})</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', margin: '0 0 4px' }}>{car.condition} · {car.category}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '700', color: '#1F2937', margin: '0 0 4px' }}>₦{car.price?.toLocaleString()}</p>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {car.availableForSale && <span style={{ background: '#E9F1F6', color: '#1F2937', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontFamily: 'Inter, sans-serif' }}>For Sale</span>}
                      {car.availableForRent && <span style={{ background: '#F0EAD6', color: '#1F2937', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontFamily: 'Inter, sans-serif' }}>For Rent · ₦{car.rentalPricePerDay?.toLocaleString()}/day</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditCar(car)} style={{ flex: 1, background: '#F0F0EC', color: '#1F2937', border: 'none', padding: '8px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDeleteCar(car.id)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {cars.length === 0 && !loading && (
                <div className="col-12">
                  <p style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', textAlign: 'center', padding: '40px' }}>No vehicles added yet. Click "+ Add Vehicle" to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="row g-3">
            {enquiries.length === 0 && <p style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', padding: '20px' }}>No enquiries yet.</p>}
            {[...enquiries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(e => (
              <div key={e.id} className="col-md-6">
                <div style={{ background: 'white', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: '0' }}>{e.name}</p>
                    <select value={e.status} onChange={ev => updateStatus('enquiries', e.id, ev.target.value)} style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '2px 8px' }}>
                      <option>New</option><option>Contacted</option><option>Closed</option>
                    </select>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', margin: '0 0 6px' }}>{e.phone} · {e.email}</p>
                  {e.carName && <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', margin: '0 0 6px' }}>Re: {e.carName}</p>}
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#374151', margin: '0' }}>{e.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RENTALS */}
        {activeTab === 'rentals' && (
          <div className="row g-3">
            {rentals.length === 0 && <p style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', padding: '20px' }}>No rental reservations yet.</p>}
            {[...rentals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(r => (
              <div key={r.id} className="col-md-6">
                <div style={{ background: 'white', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: '0' }}>{r.name}</p>
                    <select value={r.status} onChange={ev => updateStatus('rentals', r.id, ev.target.value)} style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '2px 8px' }}>
                      <option>Pending Confirmation</option><option>Confirmed</option><option>Completed</option><option>Cancelled</option>
                    </select>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 4px' }}>{r.carName}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>{r.pickupDate} → {r.returnDate} ({r.days} days)</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#374151', margin: '0' }}>Total: ₦{r.totalCost?.toLocaleString()} · Deposit: ₦{r.depositPaid?.toLocaleString()} (card ending {r.cardLast4})</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SERVICING */}
        {activeTab === 'servicing' && (
          <div className="row g-3">
            {serviceBookings.length === 0 && <p style={{ fontFamily: 'Inter, sans-serif', color: '#6B7280', padding: '20px' }}>No service bookings yet.</p>}
            {[...serviceBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(s => (
              <div key={s.id} className="col-md-6">
                <div style={{ background: 'white', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: '0' }}>{s.name}</p>
                    <select value={s.status} onChange={ev => updateStatus('serviceBookings', s.id, ev.target.value)} style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '2px 8px' }}>
                      <option>Pending</option><option>Confirmed</option><option>Completed</option>
                    </select>
                  </div>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', margin: '0 0 4px' }}>{s.phone} · {s.email}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 4px' }}>{s.vehicleMake} ({s.vehicleYear}) — {s.serviceType}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#6B7280', margin: '0' }}>Preferred: {s.preferredDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Car Modal */}
      {showCarForm && (
        <div onClick={() => setShowCarForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleSaveCar} style={{ background: 'white', borderRadius: '10px', padding: '32px', maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '20px', color: '#1F2937', margin: '0 0 20px' }}>{editingCarId ? 'Edit Vehicle' : 'Add Vehicle'}</p>

            <div className="row g-3">
              <div className="col-md-6">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Make</label>
                <input required value={carForm.make} onChange={e => setCarForm({ ...carForm, make: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box' }} />
              </div>
              <div className="col-md-6">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Model</label>
                <input required value={carForm.model} onChange={e => setCarForm({ ...carForm, model: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box' }} />
              </div>
              <div className="col-md-4">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Year</label>
                <input required type="number" value={carForm.year} onChange={e => setCarForm({ ...carForm, year: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box' }} />
              </div>
              <div className="col-md-4">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Price (₦)</label>
                <input required type="number" value={carForm.price} onChange={e => setCarForm({ ...carForm, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box' }} />
              </div>
              <div className="col-md-4">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Mileage (km)</label>
                <input type="number" value={carForm.mileage} onChange={e => setCarForm({ ...carForm, mileage: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box' }} />
              </div>
              <div className="col-md-4">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Category</label>
                <select value={carForm.category} onChange={e => setCarForm({ ...carForm, category: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box', background: 'white' }}>
                  <option>SUV</option><option>Executive Sedan</option><option>Luxury</option><option>Family</option><option>Sports</option>
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Condition</label>
                <select value={carForm.condition} onChange={e => setCarForm({ ...carForm, condition: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box', background: 'white' }}>
                  <option>Brand New</option><option>Pre-Owned</option>
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Transmission</label>
                <select value={carForm.transmission} onChange={e => setCarForm({ ...carForm, transmission: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box', background: 'white' }}>
                  <option>Automatic</option><option>Manual</option>
                </select>
              </div>
              <div className="col-md-4">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Fuel Type</label>
                <select value={carForm.fuelType} onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box', background: 'white' }}>
                  <option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option>
                </select>
              </div>

              <div className="col-12">
                <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Description</label>
                <textarea rows="3" value={carForm.description} onChange={e => setCarForm({ ...carForm, description: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>

              <div className="col-12">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>Vehicle Photos</label>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '6px', background: '#fff' }} />
                {uploadingImages && <p style={{ marginTop: '10px', color: '#f5c542' }}>Uploading images...</p>}
                {carForm.images?.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginTop: '12px' }}>
                    {carForm.images.map((url, index) => (
                      <div key={`${url}-${index}`} style={{ position: 'relative' }}>
                        <img src={url} alt={`Vehicle ${index + 1}`} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                        <button type="button" onClick={() => setCarForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))} style={{ position: 'absolute', top: '4px', right: '4px', width: '26px', height: '26px', border: 'none', borderRadius: '50%', background: '#dc3545', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-6" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="forSale" checked={carForm.availableForSale} onChange={e => setCarForm({ ...carForm, availableForSale: e.target.checked })} />
                <label htmlFor="forSale" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#374151' }}>Available for Sale</label>
              </div>
              <div className="col-6" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="forRent" checked={carForm.availableForRent} onChange={e => setCarForm({ ...carForm, availableForRent: e.target.checked })} />
                <label htmlFor="forRent" style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#374151' }}>Available for Rent</label>
              </div>

              {carForm.availableForRent && (
                <div className="col-12">
                  <label style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '4px' }}>Rental Price Per Day (₦)</label>
                  <input type="number" value={carForm.rentalPricePerDay} onChange={e => setCarForm({ ...carForm, rentalPricePerDay: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1.5px solid #E5E7EB', boxSizing: 'border-box' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button type="button" onClick={() => setShowCarForm(false)} style={{ flex: 1, background: '#F0F0EC', color: '#374151', border: 'none', padding: '12px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ flex: 2, background: '#17181C', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>{editingCarId ? 'Save Changes' : 'Add Vehicle'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Logout confirm */}
      {showLogoutConfirm && (
        <div onClick={() => setShowLogoutConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '10px', padding: '28px', maxWidth: '340px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Bodoni Moda, serif', fontSize: '18px', color: '#1F2937', margin: '0 0 8px' }}>Log out?</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>You'll need the admin password to access this dashboard again.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, background: '#F0F0EC', border: 'none', padding: '10px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmLogout} style={{ flex: 1, background: '#DC2626', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin