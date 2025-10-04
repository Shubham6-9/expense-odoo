import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignOptions from './pages/SignOptions'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SignOptions />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
