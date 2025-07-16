import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VerifyPage from './pages/VerifyPage';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <Navbar />
      <div className='p-4'>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:token" element={<VerifyPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
