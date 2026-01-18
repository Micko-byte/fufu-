import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import PaymentCallback from './pages/PaymentCallback'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
