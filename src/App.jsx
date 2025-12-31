import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeScreen from './components/HomeScreen'
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/verify" element={<ExpertVerification />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  )
}

export default App

