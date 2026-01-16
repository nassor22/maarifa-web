import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

function Freelance() {
  const [searchQuery, setSearchQuery] = useState('')

  const freelancers = [
    {
      id: 1,
      name: 'Jane Wanjiku',
      username: 'janewanjiku',
      title: 'Full Stack Developer',
      category: 'Web Development',
      location: 'Nairobi, Kenya',
      rating: 4.9,
      reviews: 127,
      hourlyRate: '$45-65',
      skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      availability: 'Available',
      completedProjects: 89,
      description: 'Experienced full-stack developer specializing in modern web applications. 5+ years of professional experience.',
      verified: true
    },
    {
      id: 2,
      name: 'John Kamau',
      username: 'johnkamau',
      title: 'UI/UX Designer',
      category: 'Design',
      location: 'Kampala, Uganda',
      rating: 4.8,
      reviews: 94,
      hourlyRate: '$35-50',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      availability: 'Available',
      completedProjects: 62,
      description: 'Creative designer with a passion for creating intuitive and beautiful user experiences.',
      verified: true
    },
    {
      id: 3,
      name: 'Amina Hassan',
      username: 'aminahassan',
      title: 'Content Writer & Translator',
      category: 'Writing & Translation',
      location: 'Dar es Salaam, Tanzania',
      rating: 5.0,
      reviews: 156,
      hourlyRate: '$25-40',
      skills: ['English', 'Swahili', 'Arabic', 'SEO Writing'],
      availability: 'Busy',
      completedProjects: 203,
      description: 'Professional writer and translator fluent in multiple languages. Specialized in technical and marketing content.',
      verified: true
    },
    {
      id: 4,
      name: 'David Osei',
      username: 'davidosei',
      title: 'Mobile App Developer',
      category: 'Mobile Development',
      location: 'Accra, Ghana',
      rating: 4.7,
      reviews: 78,
      hourlyRate: '$40-60',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      availability: 'Available',
      completedProjects: 45,
      description: 'Mobile development expert building cross-platform applications for startups and enterprises.',
      verified: false
    },
    {
      id: 5,
      name: 'Sarah Ndlovu',
      username: 'sarahndlovu',
      title: 'Digital Marketing Specialist',
      category: 'Marketing',
      location: 'Cape Town, South Africa',
      rating: 4.9,
      reviews: 112,
      hourlyRate: '$30-45',
      skills: ['SEO', 'Social Media', 'Google Ads', 'Analytics'],
      availability: 'Available',
      completedProjects: 134,
      description: 'Results-driven marketer helping businesses grow their online presence and reach their target audience.',
      verified: true
    }
  ]

  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         freelancer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Freelance Marketplace</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Find skilled professionals for your projects</p>
            </div>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, skill, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Freelancers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {filteredFreelancers.length} freelancer{filteredFreelancers.length !== 1 ? 's' : ''} found
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <Link
              key={freelancer.id}
              to={`/profile/${freelancer.username}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md hover:border-primary-500 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {freelancer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                      {freelancer.name}
                      {freelancer.verified && <span className="text-blue-500">✓</span>}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{freelancer.title}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <StarIconSolid className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{freelancer.rating}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">({freelancer.reviews} reviews)</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {freelancer.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {freelancer.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 text-xs rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Info Grid */}
              <div className="space-y-2 text-sm border-t dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="h-4 w-4" />
                    {freelancer.location}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <CurrencyDollarIcon className="h-4 w-4" />
                    {freelancer.hourlyRate}/hr
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    freelancer.availability === 'Available' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                    {freelancer.availability}
                  </span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {freelancer.completedProjects} projects completed
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredFreelancers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No freelancers found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Freelance
