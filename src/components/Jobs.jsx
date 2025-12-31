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
  MapPinIcon,
  ClockIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'

function Jobs() {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    reputation: 245
  })

  const jobs = [
    {
      id: 1,
      title: 'Software Developer',
      company: 'Tech Solutions Ltd',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      salary: 'KES 150,000 - 250,000',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Medical Officer',
      company: 'Nairobi Hospital',
      location: 'Nairobi, Kenya',
      type: 'Full-time',
      salary: 'Competitive',
      posted: '3 days ago'
    },
    {
      id: 3,
      title: 'Accountant',
      company: 'Financial Services Group',
      location: 'Mombasa, Kenya',
      type: 'Contract',
      salary: 'KES 100,000 - 150,000',
      posted: '1 week ago'
    }
  ]

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
                className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
              >
                <BriefcaseIcon className="h-5 w-5" />
                <span className="font-medium">Jobs</span>
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Job Opportunities</h2>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                  <p className="text-primary-600 font-medium mt-1">{job.company}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {job.location}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {job.type}
                    </span>
                    <span className="font-semibold text-green-600">{job.salary}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {job.posted}
                  </span>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Jobs
