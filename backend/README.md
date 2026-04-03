# MaarifaHub Backend API

A Node.js Express backend API for the MaarifaHub platform with PostgreSQL database.

## Features

- User authentication with JWT
- User management
- Post creation and management
- Job listings
- Freelancer profiles
- Messaging system
- PostgreSQL database with Sequelize ORM

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL credentials and configuration.

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (requires authentication)
- `DELETE /api/users/:id` - Delete user (requires authentication)

### Posts
- `POST /api/posts` - Create a new post (requires authentication)
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (requires authentication)
- `DELETE /api/posts/:id` - Delete post (requires authentication)

### Jobs
- `POST /api/jobs` - Create a new job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Messages
- `POST /api/messages` - Send a message
- `GET /api/messages/conversation/:conversationId` - Get conversation messages
- `GET /api/messages/:id` - Get message by ID
- `PUT /api/messages/:id` - Update message
- `DELETE /api/messages/:id` - Delete message

### Freelancers
- `POST /api/freelancers` - Create freelancer profile
- `GET /api/freelancers` - Get all freelancers
- `GET /api/freelancers/:id` - Get freelancer by ID
- `PUT /api/freelancers/:id` - Update freelancer profile
- `DELETE /api/freelancers/:id` - Delete freelancer profile

### Health Check
- `GET /api/health` - Check API status

## Database Models

- **User** - User accounts with authentication
- **Post** - Community posts (questions, information, opinions, knowledge)
- **Job** - Job listings
- **Freelancer** - Freelancer profiles
- **Message** - Messages between users
- **Conversation** - Conversation threads

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Environment Variables

See `.env.example` for all available environment variables:

- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origins

## Development

To run in development mode with auto-reload:

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

## License

ISC
