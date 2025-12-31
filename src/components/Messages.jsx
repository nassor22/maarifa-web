import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  HomeIcon, 
  QuestionMarkCircleIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PaperAirplaneIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'

function Messages() {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    reputation: 245
  })

  const [selectedChat, setSelectedChat] = useState(1)
  const [messageText, setMessageText] = useState('')

  const conversations = [
    {
      id: 1,
      name: 'Dr. Amina Kamau',
      lastMessage: 'Thank you for the follow-up question!',
      time: '2h ago',
      unread: 2
    },
    {
      id: 2,
      name: 'Prof. James Omondi',
      lastMessage: 'I can help you with that...',
      time: '5h ago',
      unread: 0
    },
    {
      id: 3,
      name: 'Mary Wanjiru',
      lastMessage: 'Here are some resources that might help',
      time: '1d ago',
      unread: 1
    }
  ]

  const messages = [
    {
      id: 1,
      sender: 'Dr. Amina Kamau',
      text: 'Hello! I saw your question about diabetes management.',
      time: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      text: 'Hi! Yes, I would appreciate your expert advice.',
      time: '10:35 AM',
      isOwn: true
    },
    {
      id: 3,
      sender: 'Dr. Amina Kamau',
      text: 'Thank you for the follow-up question!',
      time: '10:40 AM',
      isOwn: false
    }
  ]

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageText.trim()) {
      // Add message sending logic here
      setMessageText('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-primary-700">MaarifaHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
              >
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <Link to="/settings" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Cog6ToothIcon className="h-6 w-6" />
              </Link>
              <div className="flex items-center space-x-2 pl-3 border-l dark:border-gray-700">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">⭐ {user.reputation} reputation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-primary-700">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="p-4 space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              
              <Link
                to="/questions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <QuestionMarkCircleIcon className="h-5 w-5" />
                <span>Questions</span>
              </Link>
              
              <Link
                to="/jobs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BriefcaseIcon className="h-5 w-5" />
                <span>Jobs</span>
              </Link>
              
              <Link
                to="/experts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Find Experts</span>
              </Link>
              
              <Link
                to="/messages"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span className="font-medium">Messages</span>
              </Link>
              
              <div className="pt-4 mt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    navigate('/')
                  }}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r dark:border-gray-700">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Conversations</h3>
              </div>
              <div className="overflow-y-auto" style={{ height: 'calc(600px - 73px)' }}>
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedChat === conv.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{conv.name}</h4>
                          {conv.unread > 0 && (
                            <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">{conv.lastMessage}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{conv.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {conversations.find(c => c.id === selectedChat)?.name}
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(600px - 145px)' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-xs mt-1 block ${
                        msg.isOwn ? 'text-primary-100' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Messages
