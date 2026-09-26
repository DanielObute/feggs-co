import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import Inventory from './components/Inventory'
import CarDetail from './components/CarDetail'
import Rental from './components/Rental'
import Servicing from './components/Servicing'
import About from './components/About'
import Contact from './components/Contact'
import Admin from './components/Admin'

function App() {
  return (
    <HashRouter>
      <CustomCursor />
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<CarDetail />} />
          <Route path="/rental" element={<Rental />} />
          <Route path="/servicing" element={<Servicing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <Footer />
    </HashRouter>
  )
}

export default App