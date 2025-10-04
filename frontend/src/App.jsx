import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignOptions from './pages/SignOptions'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/dashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignOptions />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff23bbc',
              color: '#3e3e3eff',
              fontWeight: 'bold',
              borderRadius: '12px',
            },
            success: {
              style: {
                background: '#22c55e',
                color: '#fff',
              },
            },
            error: {
              duration: 6000,
              style: {
                background: '#dc2626',
                color: '#fff',
              },
            },
          }}
        />
      </Router>
    </>
  )
}

export default App
