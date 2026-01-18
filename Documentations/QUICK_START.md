# MaarifaHub - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Prerequisites Check
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### 2. Install & Run
```bash
# You're already in the project directory!
# Dependencies are installed
# Server is running at http://localhost:5173

# If server is not running:
npm run dev
```

### 3. Access the Application
Open your browser and navigate to: **http://localhost:5173**

## 📱 Available Pages & Routes

| Route | Description | Features |
|-------|-------------|----------|
| `/` | Login Page | Sign in to your account |
| `/register` | Registration | Create new account with role selection |
| `/forgot-password` | Password Reset | Request password reset link |
| `/dashboard` | Main Dashboard | Browse categories, view posts, navigation |
| `/create-post` | Create Post | Compose new questions/knowledge posts |
| `/post/:id` | Post Detail | View post, comments, voting |
| `/verify` | Expert Verification | Submit credentials for verification |

## 🎯 Testing User Flows

### Flow 1: New User Registration
1. Go to http://localhost:5173
2. Click "Sign up"
3. Fill in the registration form
4. Select a role (Community Member or Expert)
5. Click "Create Account"

### Flow 2: Dashboard Exploration
1. From login, click any navigation
2. Browse 9 different categories
3. View recent posts
4. Click on a post to see details

### Flow 3: Creating Content
1. From dashboard, click "What would you like to share..."
2. Select post type (Question, Information, Opinion, Knowledge)
3. Choose a category
4. Write title and content
5. Add optional tags
6. Click "Publish Post"

### Flow 4: Expert Verification
1. Register as an Expert
2. From dashboard, click "Start Verification" in sidebar
3. Fill in professional details
4. Upload credentials
5. Submit for review

## 🎨 UI Components Showcase

### Color-Coded Post Types
- **Green** = Question (asking for help)
- **Purple** = Information (sharing news/facts)
- **Blue** = Opinion (personal views)
- **Gold** = Knowledge (expert content)

### User Badges
- **⭐ Gold Star** = Verified Expert
- **⭐ White Star** = Community Member reputation

### Interactive Elements
- Upvote/downvote buttons
- Comment forms
- Follow buttons
- Report/flag options
- Share functionality

## 🛠️ Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install new dependencies
npm install <package-name>
```

## 📂 Key Files to Know

### Pages/Components
```
src/components/
  ├── HomeScreen.jsx          # Login page
  ├── Register.jsx            # User registration
  ├── Dashboard.jsx           # Main hub
  ├── CreatePost.jsx          # Post composer
  ├── PostDetail.jsx          # Individual post view
  └── ExpertVerification.jsx  # Credential submission
```

### Configuration
```
tailwind.config.js    # Styling configuration
vite.config.js        # Build tool settings
package.json          # Dependencies
```

### Documentation
```
README.md                 # Project overview
ARCHITECTURE.md           # System design
DATABASE_SCHEMA.md        # Data structure
API_DOCUMENTATION.md      # API reference
DEPLOYMENT.md             # Deploy guide
IMPLEMENTATION_SUMMARY.md # What's completed
```

## 🔧 Making Changes

The dev server has **hot module replacement** enabled. Just:
1. Edit any `.jsx` or `.css` file
2. Save the file
3. Browser updates automatically!

### Example: Change the primary color
1. Open `tailwind.config.js`
2. Modify the `primary` color values
3. Save and see instant changes

### Example: Add a new page
1. Create `src/components/NewPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/new" element={<NewPage />} />
   ```
3. Navigate to `/new`

## 🎓 Understanding the Stack

### React
- **Component-based** UI library
- **Hooks** for state management (useState, useEffect)
- **JSX** syntax (HTML-like in JavaScript)

### React Router
- **Client-side routing** (no page reloads)
- **Dynamic routes** with parameters (/post/:id)
- **Link component** for navigation

### Tailwind CSS
- **Utility-first** CSS framework
- **Responsive** by default (sm:, md:, lg:)
- **No custom CSS files** needed for styling

### Vite
- **Lightning fast** development server
- **Hot Module Replacement** (instant updates)
- **Optimized** production builds

## 🐛 Troubleshooting

### Port 5173 already in use?
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Module not found error?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Styling not working?
```bash
# Rebuild Tailwind
npm run dev
# Ctrl+C and restart if needed
```

### Browser cache issues?
- Hard refresh: `Ctrl+Shift+R` (Linux/Windows)
- Or open in incognito mode

## 📚 Learning Resources

### React
- [Official React Docs](https://react.dev)
- [React Hooks Guide](https://react.dev/reference/react)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)

### Vite
- [Vite Guide](https://vitejs.dev/guide/)

## 💡 Tips for Development

1. **Keep the terminal open** to see error messages
2. **Use browser DevTools** (F12) for debugging
3. **Check Console tab** for JavaScript errors
4. **Use React DevTools** extension for component inspection
5. **Test mobile view** using browser responsive mode

## 🔐 Current Limitations (Frontend Only)

⚠️ The following features need backend integration:
- Actual user authentication
- Data persistence
- Real post creation/editing
- User profiles
- Messaging system
- Search functionality
- Image uploads
- Email notifications

Currently displaying **mock data** for demonstration.

## ✅ What's Fully Working

- ✅ All page navigation
- ✅ Responsive design
- ✅ Form validation
- ✅ UI interactions
- ✅ Hot reload development
- ✅ Component rendering
- ✅ Styling system
- ✅ Route handling

## 🚀 Next Steps

1. **Explore all pages** - Navigate through every route
2. **Read the docs** - Check ARCHITECTURE.md and API_DOCUMENTATION.md
3. **Modify components** - Try changing colors, text, layouts
4. **Plan backend** - Review DATABASE_SCHEMA.md for API planning
5. **Deploy** - Follow DEPLOYMENT.md when ready for production

## 📞 Quick Reference

**Dev Server:** http://localhost:5173
**Stop Server:** `Ctrl+C` in terminal
**Restart Server:** `npm run dev`
**Check Status:** Terminal shows Vite messages

---

**Happy Coding! 🎉**

Need help? Check the comprehensive documentation files or open an issue.
