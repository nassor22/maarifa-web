import { useState, useEffect } from 'react'
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
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ComputerDesktopIcon,
  ScaleIcon,
  GlobeAltIcon,
  BookOpenIcon,
  UsersIcon,
  TrophyIcon
} from '@heroicons/react/24/solid'
import { useTheme } from '../contexts/ThemeContext'

function Dashboard() {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    role: 'community_member',
    reputation: 245,
    isVerified: false
  })

  const [recentPosts, setRecentPosts] = useState([])

  // Load posts from localStorage on component mount
  useEffect(() => {
    const loadPosts = () => {
      const userPosts = JSON.parse(localStorage.getItem('userPosts') || '[]')
      const mockPosts = [
        {
          id: 1,
          type: 'question',
          title: 'What are the best practices for diabetes management?',
          author: 'healthseeker',
          category: 'Health & Well-being',
          replies: 12,
          upvotes: 24,
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'knowledge',
          title: 'Understanding Climate-Smart Agriculture in East Africa',
          author: 'Dr. Amina K.',
          category: 'Agriculture & Environment',
          replies: 8,
          upvotes: 45,
          time: '4 hours ago',
          isExpert: true
        },
        {
          id: 3,
          type: 'information',
          title: 'New Fintech Regulations in Kenya',
          author: 'financeexpert',
          category: 'Finance & Business',
          replies: 15,
          upvotes: 38,
          time: '6 hours ago'
        }
      ]
      // Combine user posts with mock posts
      setRecentPosts([...userPosts, ...mockPosts])
    }
    
    loadPosts()
  }, [])

  const categories = [
    { name: 'Health & Well-being', icon: HeartIcon, color: 'text-green-600', posts: 1234 },
    { name: 'Finance & Business', icon: CurrencyDollarIcon, color: 'text-blue-600', posts: 892 },
    { name: 'Education & Knowledge', icon: AcademicCapIcon, color: 'text-purple-600', posts: 756 },
    { name: 'Technology', icon: ComputerDesktopIcon, color: 'text-indigo-600', posts: 1543 },
    { name: 'Law', icon: ScaleIcon, color: 'text-red-600', posts: 423 },
    { name: 'Agriculture & Environment', icon: GlobeAltIcon, color: 'text-green-500', posts: 567 },
    { name: 'Religion & Ethics', icon: BookOpenIcon, color: 'text-amber-600', posts: 345 },
    { name: 'Community Development', icon: UsersIcon, color: 'text-pink-600', posts: 234 },
    { name: 'Sports & Entertainment', icon: TrophyIcon, color: 'text-orange-600', posts: 678 }
  ]

  const getPostTypeColor = (type) => {
    const colors = {
      question: 'bg-green-100 text-green-800',
      information: 'bg-purple-100 text-purple-800',
      opinion: 'bg-blue-100 text-blue-800',
      knowledge: 'bg-amber-100 text-amber-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400">MaarifaHub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Search categories"
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>
              <Link to="/notifications" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
              <Link to="/settings" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Cog6ToothIcon className="h-6 w-6" />
              </Link>
              <Link to="/profile" className="flex items-center space-x-2 pl-3 border-l dark:border-gray-700 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">⭐ {user.reputation} reputation</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Slide-out Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-bold text-primary-700 dark:text-primary-400">Menu</h2>
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
                className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                <HomeIcon className="h-5 w-5" />
                <span className="font-medium">Home</span>
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
                className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <span>Messages</span>
              </Link>
              
              <div className="pt-4 mt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    navigate('/')
                  }}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* Search/Category Modal */}
      {isSearchModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
            onClick={() => setIsSearchModalOpen(false)}
          ></div>
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto transform transition-all">
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 rounded-t-2xl">
                <div className="p-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search & Browse</h2>
                  <button
                    onClick={() => setIsSearchModalOpen(false)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="px-6 pb-6">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {categories.filter(category => 
                  category.name.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No categories found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {categories
                      .filter(category => 
                        category.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((category) => (
                      <Link
                        key={category.name}
                        to={`/category/${category.name.toLowerCase().replace(/\\s+/g, '-')}`}
                        onClick={() => setIsSearchModalOpen(false)}
                        className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:shadow-md transition-all dark:hover:bg-gray-700"
                      >
                        <category.icon className={`h-8 w-8 ${category.color} mb-2`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-white text-center">{category.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{category.posts} posts</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="space-y-6">
            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Discussions</h2>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:shadow-md transition-all dark:bg-gray-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getPostTypeColor(post.type)}`}>
                        {post.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{post.time}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <span className="font-medium">
                            {post.author}
                            {post.isExpert && <span className="ml-1 text-amber-500">⭐</span>}
                          </span>
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">•</span>
                        <span>{post.category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span>↑ {post.upvotes}</span>
                        <span>💬 {post.replies}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* Floating Create Post Button */}
      <div className="fixed bottom-8 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link 
            to="/create-post"
            className="block w-full text-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 rounded-full text-white font-semibold transition-all shadow-2xl hover:shadow-primary-500/50 transform hover:scale-105 hover:-translate-y-1"
          >
            ✨ What would you like to share or ask today?
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
