import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import HomeScreen from './components/HomeScreen'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import CreatePost from './components/CreatePost'
import ExpertVerification from './components/ExpertVerification'
import PostDetail from './components/PostDetail'
import Questions from './components/Questions'
import Jobs from './components/Jobs'
import Experts from './components/Experts'
import Messages from './components/Messages'
import Settings from './components/Settings'
import Notifications from './components/Notifications'
import Profile from './components/Profile'
import Freelance from './components/Freelance'

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if this is the first load
    const hasLoadedBefore = sessionStorage.getItem('hasLoadedBefore')
    
    if (!hasLoadedBefore) {
      // First time loading, show splash screen
      setIsLoading(true)
    } else {
      // Already loaded once in this session, skip splash
      setIsLoading(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasLoadedBefore', 'true')
    setIsLoading(false)
  }

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><ExpertVerification /></ProtectedRoute>} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/questions" element={<ProtectedRoute><Questions /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/experts" element={<ProtectedRoute><Experts /></ProtectedRoute>} />
        <Route path="/freelance" element={<ProtectedRoute><Freelance /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App

