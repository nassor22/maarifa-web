import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { 
  ArrowLeftIcon, 
  ChatBubbleLeftIcon,
  FlagIcon,
  ShareIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline'
import { 
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid'
import { useTheme } from '../contexts/ThemeContext'

function PostDetail() {
  const { id } = useParams()
  const { darkMode, toggleDarkMode } = useTheme()
  const [commentContent, setCommentContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock data - will be fetched from API
  const post = {
    id: parseInt(id),
    type: 'question',
    title: 'What are the best practices for diabetes management in Kenya?',
    content: `I'm a 45-year-old recently diagnosed with Type 2 diabetes. My doctor has given me some basic guidelines, but I'd like to hear from others about:

1. Effective dietary changes that work with local Kenyan foods
2. Exercise routines that fit busy work schedules
3. How to access affordable medication and testing supplies
4. Support groups or resources in Nairobi

Any advice would be greatly appreciated. Thank you!`,
    author: {
      id: 123,
      username: 'healthseeker',
      isVerified: false,
      reputation: 85
    },
    category: {
      id: 1,
      name: 'Health & Well-being'
    },
    tags: ['diabetes', 'health', 'kenya', 'nutrition'],
    upvotes: 24,
    downvotes: 1,
    userVote: null, // 1, -1, or null
    viewCount: 345,
    commentCount: 8,
    createdAt: '2 hours ago',
    updatedAt: null
  }

  const comments = [
    {
      id: 1,
      author: {
        id: 456,
        username: 'Dr. Amina K.',
        isVerified: true,
        reputation: 1850
      },
      content: 'As a medical professional specializing in diabetes care, I can provide some guidance. First, incorporating ugali made from whole grain flour, sukuma wiki, and beans can help manage blood sugar levels. These are affordable and locally available. Regular monitoring is crucial - you can find affordable glucometers at most pharmacies...',
      upvotes: 18,
      downvotes: 0,
      userVote: null,
      isAcceptedAnswer: true,
      replies: [
        {
          id: 2,
          author: {
            id: 123,
            username: 'healthseeker',
            isVerified: false,
            reputation: 85
          },
          content: 'Thank you so much Dr. Amina! This is very helpful. Do you have any specific recommendations for glucometers?',
          upvotes: 3,
          downvotes: 0,
          createdAt: '1 hour ago'
        }
      ],
      createdAt: '1 hour ago'
    },
    {
      id: 3,
      author: {
        id: 789,
        username: 'livingwellkenya',
        isVerified: false,
        reputation: 420
      },
      content: 'I\'ve been managing diabetes for 3 years now. The Diabetes Kenya support group has monthly meetups in Nairobi. They\'ve been incredibly helpful for emotional support and practical tips.',
      upvotes: 12,
      downvotes: 0,
      userVote: null,
      isAcceptedAnswer: false,
      replies: [],
      createdAt: '30 minutes ago'
    }
  ]

  const handleVote = (value) => {
    console.log('Vote:', value)
    // TODO: Implement voting API call
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // TODO: Implement comment submission API call
    console.log('New comment:', commentContent)
    
    setTimeout(() => {
      setIsSubmitting(false)
      setCommentContent('')
      alert('Comment posted!')
    }, 1000)
  }

  const getPostTypeColor = (type) => {
    const colors = {
      question: 'bg-green-100 text-green-800 border-green-200',
      information: 'bg-purple-100 text-purple-800 border-purple-200',
      opinion: 'bg-blue-100 text-blue-800 border-blue-200',
      knowledge: 'bg-amber-100 text-amber-800 border-amber-200'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all active:scale-95"
              >
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>
              <Link to="/dashboard" className="text-2xl font-bold text-primary-700 dark:text-primary-400">
                MaarifaHub
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Voting Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-4">
              <div className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => handleVote(1)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.userVote === 1 
                      ? 'bg-primary-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <ArrowUpIcon className="h-6 w-6" />
                </button>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {post.upvotes - post.downvotes}
                </span>
                <button
                  onClick={() => handleVote(-1)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.userVote === -1 
                      ? 'bg-red-600 text-white' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <ArrowDownIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <button className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                  <ShareIcon className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 py-2">
                  <FlagIcon className="h-4 w-4" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            {/* Post */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${getPostTypeColor(post.type)}`}>
                  {post.type.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{post.createdAt}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>

              {/* Meta Info */}
              <div className="flex items-center space-x-4 mb-4 pb-4 border-b dark:border-gray-700">
                <Link 
                  to={`/users/${post.author.id}`}
                  className="flex items-center space-x-2 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {post.author.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {post.author.username}
                      {post.author.isVerified && <span className="ml-1 text-amber-500">⭐</span>}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {post.author.reputation} reputation
                    </div>
                  </div>
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <Link to={`/category/${post.category.name.toLowerCase()}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                  {post.category.name}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{post.viewCount} views</span>
              </div>

              {/* Content */}
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{post.content}</p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {post.commentCount} {post.commentCount === 1 ? 'Answer' : 'Answers'}
              </h2>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className={`border-l-4 pl-4 ${comment.isAcceptedAnswer ? 'border-green-500 bg-green-50 dark:bg-green-900/20 p-4 rounded-r-lg' : 'border-gray-200 dark:border-gray-700'}`}>
                    {comment.isAcceptedAnswer && (
                      <div className="text-green-700 dark:text-green-400 font-semibold text-sm mb-2">
                        ✓ Accepted Answer
                      </div>
                    )}
                    
                    {/* Comment Header */}
                    <div className="flex items-center justify-between mb-3">
                      <Link 
                        to={`/users/${comment.author.id}`}
                        className="flex items-center space-x-2 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {comment.author.username[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.author.username}
                            {comment.author.isVerified && <span className="ml-1 text-amber-500">⭐</span>}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{comment.createdAt}</span>
                        </div>
                      </Link>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                          <ArrowUpIcon className="h-4 w-4" />
                          <span className="text-sm">{comment.upvotes}</span>
                        </button>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>

                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 text-sm">
                      <button className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Reply</button>
                      <button className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">Report</button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 ml-6 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {reply.author.username[0].toUpperCase()}
                              </div>
                              <span className="font-medium text-sm text-gray-900 dark:text-white">{reply.author.username}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{reply.createdAt}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Answer</h3>
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Share your knowledge or experience..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-y bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Be respectful and provide helpful information
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting || !commentContent.trim()}
                      className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Answer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail
