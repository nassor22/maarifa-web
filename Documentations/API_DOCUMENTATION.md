# MaarifaHub REST API Documentation

## Base URL
```
https://api.maarifahub.com/v1
```

## Authentication

All authenticated requests require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user account

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "phone": "string (optional)",
  "password": "string",
  "role": "community_member | verified_expert_individual | verified_expert_org"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": 123,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "community_member",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Authenticate and obtain JWT token

**Request Body:**
```json
{
  "username_or_email": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 123,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "community_member",
    "is_verified": false,
    "reputation_score": 245
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/forgot-password
Request password reset

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset link sent to email"
}
```

#### POST /auth/reset-password
Reset password with token

**Request Body:**
```json
{
  "token": "string",
  "new_password": "string"
}
```

### Users

#### GET /users/:id
Get user profile

**Response:** `200 OK`
```json
{
  "id": 123,
  "username": "johndoe",
  "role": "community_member",
  "is_verified": false,
  "reputation_score": 245,
  "bio": "string",
  "location": "Nairobi, Kenya",
  "created_at": "2024-01-15T10:30:00Z",
  "stats": {
    "posts": 15,
    "comments": 87,
    "followers": 42,
    "following": 38
  }
}
```

#### PUT /users/:id
Update user profile (authenticated)

**Request Body:**
```json
{
  "bio": "string",
  "location": "string",
  "profile_picture_url": "string"
}
```

#### GET /users/:id/posts
Get user's posts with pagination

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `type` (optional: question, information, opinion, knowledge)

#### GET /users/:id/followers
Get user's followers

#### POST /users/:id/follow
Follow a user (authenticated)

#### DELETE /users/:id/follow
Unfollow a user (authenticated)

### Expert Verification

#### POST /verification/submit
Submit credentials for verification (authenticated)

**Request Body (multipart/form-data):**
```
full_name: string
profession: string
category_id: integer
organization: string (optional)
credentials_description: text
linkedin_url: string
other_profile_urls: text (optional)
education_proof: file
certifications: file[] (optional)
```

**Response:** `201 Created`
```json
{
  "id": 456,
  "status": "pending",
  "submitted_at": "2024-01-15T10:30:00Z",
  "message": "Verification request submitted successfully"
}
```

#### GET /verification/status
Check verification status (authenticated)

**Response:** `200 OK`
```json
{
  "id": 456,
  "status": "pending | approved | rejected",
  "submitted_at": "2024-01-15T10:30:00Z",
  "reviewed_at": "2024-01-17T15:20:00Z",
  "review_notes": "string (if rejected)"
}
```

### Categories

#### GET /categories
Get all categories

**Response:** `200 OK`
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Health & Well-being",
      "slug": "health",
      "description": "Medical, mental health, nutrition",
      "color": "#10b981",
      "post_count": 1234
    }
  ]
}
```

#### GET /categories/:slug
Get category details with posts

### Posts

#### GET /posts
Get posts with filters and pagination

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `category_id` (optional)
- `post_type` (optional)
- `tags` (optional, comma-separated)
- `sort` (latest, popular, trending)
- `search` (optional search term)

**Response:** `200 OK`
```json
{
  "posts": [
    {
      "id": 789,
      "author": {
        "id": 123,
        "username": "johndoe",
        "is_verified": false,
        "reputation_score": 245
      },
      "category": {
        "id": 1,
        "name": "Health & Well-being"
      },
      "post_type": "question",
      "title": "What are best practices for diabetes management?",
      "content": "I'm looking for...",
      "tags": ["diabetes", "health"],
      "upvotes": 24,
      "downvotes": 2,
      "comment_count": 12,
      "view_count": 345,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 50,
    "total_items": 1000,
    "items_per_page": 20
  }
}
```

#### POST /posts
Create a new post (authenticated)

**Request Body:**
```json
{
  "category_id": 1,
  "post_type": "question | information | opinion | knowledge",
  "title": "string (max 300 chars)",
  "content": "text",
  "tags": ["tag1", "tag2"]
}
```

**Response:** `201 Created`

#### GET /posts/:id
Get single post with details

**Response:** `200 OK`
```json
{
  "id": 789,
  "author": {...},
  "category": {...},
  "post_type": "question",
  "title": "string",
  "content": "text",
  "tags": [],
  "upvotes": 24,
  "downvotes": 2,
  "view_count": 345,
  "is_pinned": false,
  "is_locked": false,
  "created_at": "2024-01-15T10:30:00Z",
  "comments": [...] // See comments structure below
}
```

#### PUT /posts/:id
Update post (authenticated, author only)

#### DELETE /posts/:id
Delete post (authenticated, author or moderator)

### Comments

#### GET /posts/:id/comments
Get comments for a post

**Response:** `200 OK`
```json
{
  "comments": [
    {
      "id": 1001,
      "post_id": 789,
      "author": {
        "id": 456,
        "username": "expert_user",
        "is_verified": true,
        "reputation_score": 1850
      },
      "content": "Based on my experience...",
      "upvotes": 15,
      "downvotes": 0,
      "is_accepted_answer": true,
      "replies": [...], // Nested replies
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

#### POST /posts/:id/comments
Add comment to post (authenticated)

**Request Body:**
```json
{
  "content": "text",
  "parent_comment_id": 123 (optional, for replies)
}
```

#### PUT /comments/:id
Update comment (authenticated, author only)

#### DELETE /comments/:id
Delete comment (authenticated, author or moderator)

### Voting

#### POST /votes
Cast or update vote (authenticated)

**Request Body:**
```json
{
  "votable_type": "post | comment",
  "votable_id": 789,
  "vote_value": 1 | -1
}
```

**Response:** `200 OK`
```json
{
  "vote_value": 1,
  "new_score": 25
}
```

#### DELETE /votes
Remove vote (authenticated)

**Request Body:**
```json
{
  "votable_type": "post | comment",
  "votable_id": 789
}
```

### Messages

#### GET /messages
Get user messages (authenticated)

**Query Parameters:**
- `type` (inbox, sent)
- `page`, `limit`

#### POST /messages
Send message (authenticated)

**Request Body:**
```json
{
  "recipient_id": 456,
  "subject": "string",
  "content": "text"
}
```

#### GET /messages/:id
Get single message

#### DELETE /messages/:id
Delete message

### Notifications

#### GET /notifications
Get user notifications (authenticated)

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": 1,
      "type": "comment_reply | upvote | follow | mention",
      "title": "New reply to your post",
      "content": "Username replied to your post",
      "link": "/posts/789#comment-1001",
      "is_read": false,
      "created_at": "2024-01-15T12:00:00Z"
    }
  ],
  "unread_count": 5
}
```

#### PUT /notifications/:id/read
Mark notification as read

#### PUT /notifications/read-all
Mark all notifications as read

### Reports

#### POST /reports
Report content (authenticated)

**Request Body:**
```json
{
  "reportable_type": "post | comment | user",
  "reportable_id": 789,
  "reason": "spam | harassment | misinformation | inappropriate",
  "description": "text (optional)"
}
```

### Moderation (Moderator/Admin only)

#### GET /moderation/reports
Get pending reports

#### PUT /moderation/reports/:id
Resolve report

#### POST /moderation/actions
Take moderation action

**Request Body:**
```json
{
  "target_user_id": 123,
  "action_type": "warning | suspend | ban",
  "reason": "text",
  "duration": 7 (days, optional)
}
```

### Jobs

#### GET /jobs
Get job postings with pagination

#### POST /jobs
Create job posting (authenticated, verified experts only)

**Request Body:**
```json
{
  "category_id": 1,
  "title": "string",
  "description": "text",
  "company_name": "string",
  "location": "string",
  "employment_type": "full-time | part-time | contract",
  "salary_range": "string (optional)",
  "application_url": "url"
}
```

### Consulting

#### GET /consulting/experts
Get available experts for consulting

#### POST /consulting/request
Request consulting session (authenticated)

**Request Body:**
```json
{
  "expert_id": 456,
  "category_id": 1,
  "title": "string",
  "description": "text",
  "preferred_time": "datetime"
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional context
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## Rate Limiting

- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Posts creation: 10/hour
- Comments creation: 50/hour

Rate limit info in response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1639584000
```
