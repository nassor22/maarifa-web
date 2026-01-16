import { useState, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const [commentContent, setCommentContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isAuthenticated = useMemo(() => Boolean(localStorage.getItem('token')), [])

  // Mock database of posts
  const allPosts = {
    1: {
      id: 1,
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
      userVote: null,
      viewCount: 345,
      commentCount: 8,
      createdAt: '2 hours ago',
      updatedAt: null
    },
    2: {
      id: 2,
      type: 'knowledge',
      title: 'Understanding Climate-Smart Agriculture in East Africa',
      content: `Climate-smart agriculture is becoming increasingly important in East Africa. Here's what you need to know:

**Key Principles:**
1. Increasing agricultural productivity and incomes
2. Adapting and building resilience to climate change
3. Reducing greenhouse gas emissions

**Practical Applications:**
- Conservation agriculture techniques
- Crop diversification strategies
- Water harvesting and irrigation methods
- Agroforestry integration

Research shows that farmers who adopt these practices see 30-40% improvement in yields while reducing environmental impact.`,
      author: {
        id: 456,
        username: 'Dr. Amina K.',
        isVerified: true,
        reputation: 1850
      },
      category: {
        id: 2,
        name: 'Agriculture & Environment'
      },
      tags: ['agriculture', 'climate', 'environment', 'sustainability'],
      upvotes: 45,
      downvotes: 2,
      userVote: null,
      viewCount: 567,
      commentCount: 8,
      createdAt: '4 hours ago',
      updatedAt: null
    },
    3: {
      id: 3,
      type: 'information',
      title: 'New Fintech Regulations in Kenya - What You Need to Know',
      content: `The Central Bank of Kenya has introduced new regulations affecting digital lenders and mobile money services. Here's a comprehensive breakdown:

**Key Changes:**
1. Interest rate caps on digital loans
2. Enhanced consumer protection measures
3. Stricter licensing requirements for fintech companies
4. New data privacy requirements

**Impact on Consumers:**
- More transparent lending terms
- Better dispute resolution mechanisms
- Protection against predatory lending

**Timeline:**
All fintech companies must comply by June 2026.

These regulations aim to balance innovation with consumer protection in Kenya's rapidly growing digital finance sector.`,
      author: {
        id: 789,
        username: 'financeexpert',
        isVerified: true,
        reputation: 920
      },
      category: {
        id: 3,
        name: 'Finance & Business'
      },
      tags: ['fintech', 'regulations', 'kenya', 'digital-lending'],
      upvotes: 38,
      downvotes: 3,
      userVote: null,
      viewCount: 423,
      commentCount: 15,
      createdAt: '6 hours ago',
      updatedAt: null
    }
  }

  // Get the specific post or use a default
  const post = allPosts[id] || allPosts[1]

  const previewContent = useMemo(() => {
    if (isAuthenticated) return post.content
    const maxChars = 420
    if (post.content.length <= maxChars) return post.content
    return post.content.slice(0, maxChars).trimEnd() + '...'
  }, [isAuthenticated, post.content])

  const commentsData = {
    1: [
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
    ],
    2: [
      {
        id: 1,
        author: {
          id: 234,
          username: 'farmerJohn',
          isVerified: false,
          reputation: 340
        },
        content: 'Great article! We\'ve implemented conservation agriculture on our farm in Nakuru and have seen amazing results. Soil quality has improved significantly and we\'re using 40% less water.',
        upvotes: 15,
        downvotes: 0,
        userVote: null,
        isAcceptedAnswer: false,
        replies: [],
        createdAt: '2 hours ago'
      },
      {
        id: 2,
        author: {
          id: 567,
          username: 'AgriResearcher',
          isVerified: true,
          reputation: 1240
        },
        content: 'Important to add that agroforestry integration can increase farm resilience by 60%. The combination of crops and trees creates a microclimate that protects against extreme weather events.',
        upvotes: 22,
        downvotes: 1,
        userVote: null,
        isAcceptedAnswer: true,
        replies: [],
        createdAt: '1 hour ago'
      }
    ],
    3: [
      {
        id: 1,
        author: {
          id: 890,
          username: 'techLawyer',
          isVerified: true,
          reputation: 1450
        },
        content: 'This is a comprehensive overview. I\'d add that the new regulations also require fintech companies to have physical offices in Kenya for customer service. This is a significant change from the previous purely digital model.',
        upvotes: 25,
        downvotes: 1,
        userVote: null,
        isAcceptedAnswer: true,
        replies: [
          {
            id: 2,
            author: {
              id: 789,
              username: 'financeexpert',
              isVerified: true,
              reputation: 920
            },
            content: 'Good point! That\'s indeed one of the most significant operational changes.',
            upvotes: 8,
            downvotes: 0,
            createdAt: '30 minutes ago'
          }
        ],
        createdAt: '3 hours ago'
      },
      {
        id: 3,
        author: {
          id: 345,
          username: 'startupFounder',
          isVerified: false,
          reputation: 560
        },
        content: 'As a fintech founder, I appreciate the clarity these regulations bring. While compliance costs will increase, the consumer protection measures will help build trust in the industry long-term.',
        upvotes: 18,
        downvotes: 2,
        userVote: null,
        isAcceptedAnswer: false,
        replies: [],
        createdAt: '1 hour ago'
      }
    ]
  }

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {post.commentCount} {post.commentCount === 1 ? 'Answer' : 'Answers'}
              </h2>

              {isAuthenticated ? (
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
                          to={`/user/${comment.author.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white font-semibold">
                            {comment.author.username[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 dark:text-white">{comment.author.username}</span>
                              {comment.author.isVerified && (
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Verified Expert</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Reputation {comment.author.reputation}</span>
                          </div>
                        </Link>

                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <ArrowUpIcon className="h-5 w-5" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <ArrowDownIcon className="h-5 w-5" />
                          </button>
                          <span className="text-sm text-gray-600 dark:text-gray-300">{comment.upvotes - comment.downvotes}</span>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <p className="text-gray-800 dark:text-gray-200 mb-3 whitespace-pre-line">
                        {comment.content}
                      </p>

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-white font-semibold">
                                {reply.author.username[0].toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900 dark:text-white">{reply.author.username}</span>
                                  {reply.author.isVerified && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Verified Expert</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sign in to view full discussion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Comments and expert replies unlock after you sign in.</p>
                  <div className="flex gap-3 flex-wrap justify-center">
                    <button
                      onClick={() => navigate('/login', { state: { redirectTo: `/post/${post.id}` } })}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate('/register', { state: { redirectTo: `/post/${post.id}` } })}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold dark:bg-gray-700 dark:text-white"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              )}
            </div>
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
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{isAuthenticated ? post.content : previewContent}</p>
                {!isAuthenticated && (
                  <div className="mt-4 p-4 rounded-lg border border-primary-100 bg-primary-50 text-primary-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                    <p className="font-semibold mb-2">Sign in to read the full post and expert replies</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <button
                        onClick={() => navigate('/login', { state: { redirectTo: `/post/${post.id}` } })}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => navigate('/register', { state: { redirectTo: `/post/${post.id}` } })}
                        className="px-4 py-2 border border-primary-200 bg-white text-primary-700 rounded-lg font-semibold dark:bg-gray-900 dark:text-white dark:border-gray-700"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                )}
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
