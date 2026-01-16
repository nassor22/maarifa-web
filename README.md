# BISMILLAHI RAHMANI RAHIIM
# MaarifaHub

> **Trusted African Knowledge, Expert Verification, and Community Discussion Platform**

MaarifaHub is a platform that connects verified experts with community members across Africa to enable accurate knowledge sharing, professional guidance, and informed decision-making.

## 🎯 Purpose

To solve the widespread problem of misinformation and unverified "experts" on social media, especially in sensitive fields such as health, finance, education, law, and technology.

## ✨ Core Features

- **Expert Verification System** - Rigorous credential verification for experts
- **Discussion Forums** - Category-based knowledge sharing
- **Reputation System** - Gold stars for experts, white stars for community members
- **Direct Messaging** - Connect directly with experts
- **Job Postings** - Career opportunities from verified organizations
- **One-on-One Consulting** - Premium expert consultations
- **Moderation Tools** - Community-driven content safety

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Modern web browser

### Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd maarifaHub

# Install dependencies
npm install
cd server && npm install && cd ..

# Configure environment
cp .env.example .env
cp server/.env.example server/.env
# Edit .env files with your settings

# Start development servers
npm run dev          # Frontend (port 5173)
cd server && npm run dev  # Backend (port 5000)
```

### 🌐 Production Deployment

**This app is production-ready!** See [PRODUCTION_READY.md](PRODUCTION_READY.md) for overview.

#### Quick Deploy with Docker

```bash
# Configure environment
cp .env.docker.example .env.docker
# Edit .env.docker

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

#### Or use the automated script

```bash
./deploy.sh
```

📖 **Full deployment guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Installationbash
# Clone the repository
git clone https://github.com/yourusername/maarifahub.git

# Navigate to project directory
cd maarifahub

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
maarifahub/
├── src/
│   ├── components/          # React components
│   │   ├── HomeScreen.jsx   # Login page
│   │   ├── Register.jsx     # Registration
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── CreatePost.jsx   # Post creation
│   │   ├── ExpertVerification.jsx
│   │   └── ForgotPassword.jsx
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── ARCHITECTURE.md          # System architecture
├── DATABASE_SCHEMA.md       # Database design
├── API_DOCUMENTATION.md     # API endpoints
└── instructions.md          # Project requirements
```

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Heroicons** - Icon library

### Backend (To be implemented)
- **Django REST Framework** or **Laravel**
- **PostgreSQL** - Database
- **JWT** - Authentication
- **WebSockets** - Real-time features

## 👥 User Roles

1. **Community Member** - Ask questions, share opinions, vote
2. **Verified Expert (Individual)** - Provide professional guidance
3. **Verified Expert (Organization)** - Organizational expertise, job postings
4. **Moderator** - Content moderation and community management
5. **System Admin** - System configuration and analytics

## 📂 Categories

- Health & Well-being
- Finance & Business
- Education & Knowledge
- Technology
- Law
- Agriculture & Environment
- Religion & Ethics
- Community Development
- Sports & Entertainment
- Jobs & Careers
- One-on-One Consulting
- General Discussion

## 📝 Post Types

- **QUESTION** (Green) - Request information
- **INFORMATION** (Purple) - Share factual updates
- **OPINION** (Blue) - Personal views
- **KNOWLEDGE** (Gold) - Expert educational content

## 🔐 Security Features

- HTTPS everywhere
- JWT authentication
- Password hashing
- Role-based access control
- Input validation and sanitization
- Rate limiting
- Audit logging

## 🌍 Optimizations for Africa

- Low-bandwidth optimization
- Mobile-first responsive design
- Progressive image loading
- Offline support (planned)
- Multi-language support (planned)

## 📖 Documentation

- [System Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Project Requirements](./instructions.md)

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Structure

- Components follow functional React patterns with hooks
- Tailwind CSS for consistent styling
- Mobile-first responsive design
- Accessibility considerations (WCAG 2.1)

## 🚧 Current Status

**Phase 1: Frontend MVP (In Progress)**
- ✅ Authentication screens (Login, Register, Forgot Password)
- ✅ Dashboard with category navigation
- ✅ Post creation interface
- ✅ Expert verification submission
- ⏳ Post detail view
- ⏳ User profile pages
- ⏳ Messaging interface

**Phase 2: Backend Integration (Planned)**
- Database setup
- API implementation
- Authentication system
- Real-time notifications

**Phase 3: Advanced Features (Planned)**
- Search functionality
- Moderation dashboard
- Job posting system
- Consulting booking
- Analytics dashboard

## 🤝 Contributing

This is a civic-tech project aimed at improving information quality across Africa. Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with the goal of improving knowledge sharing and expert verification across Africa.

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for Africa**

