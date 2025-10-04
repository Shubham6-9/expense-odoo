import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignOptions from './pages/SignOptions'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/dashboard'
import ManageUsers from './pages/ManageUsers'
import PendingApproval from './pages/PendingApproval'
import ApprovedExpense from './pages/ApprovedExpense'
import RejectedExpense from './pages/RejectedExpense'
import AddExpense from './pages/AddExpense'
import ViewExpense from './pages/ViewExpense'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignOptions />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/manageUsers' element={<ManageUsers />}></Route>
          <Route path='/pending' element={<PendingApproval />}></Route>
          <Route path='/approved' element={<ApprovedExpense />}></Route>
          <Route path='/rejected' element={<RejectedExpense />}></Route>
          <Route path='/add' element={<AddExpense />}></Route>
          <Route path='/view' element={<ViewExpense />}></Route>
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
