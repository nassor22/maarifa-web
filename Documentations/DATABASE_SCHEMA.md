# Database Schema for MaarifaHub

## Tables

### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('community_member', 'verified_expert_individual', 'verified_expert_org', 'moderator', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    reputation_score INT DEFAULT 0,
    profile_picture_url VARCHAR(500),
    bio TEXT,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### Expert Verification
```sql
CREATE TABLE expert_verifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    profession VARCHAR(100) NOT NULL,
    category_id INT REFERENCES categories(id),
    organization VARCHAR(255),
    credentials_description TEXT,
    education_proof_url VARCHAR(500),
    certification_urls TEXT[], -- Array of URLs
    linkedin_url VARCHAR(500),
    other_profile_urls TEXT[],
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by INT REFERENCES users(id),
    review_notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);
```

### Categories
```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed data
INSERT INTO categories (name, slug, description, color) VALUES
('Health & Well-being', 'health', 'Medical, mental health, nutrition, and wellness', '#10b981'),
('Finance & Business', 'finance', 'Personal finance, business, entrepreneurship', '#3b82f6'),
('Education & Knowledge', 'education', 'Learning, teaching, academic guidance', '#8b5cf6'),
('Technology', 'technology', 'Software, hardware, digital innovation', '#6366f1'),
('Law', 'law', 'Legal advice and guidance', '#ef4444'),
('Agriculture & Environment', 'agriculture', 'Farming, sustainability, climate', '#22c55e'),
('Religion & Ethics', 'religion', 'Spiritual guidance and ethical discussions', '#f59e0b'),
('Community Development', 'community', 'Social programs and community building', '#ec4899'),
('Sports & Entertainment', 'sports', 'Athletics, arts, and entertainment', '#f97316'),
('Jobs & Careers', 'jobs', 'Career guidance and job opportunities', '#14b8a6'),
('One-on-One Consulting', 'consulting', 'Premium expert consultations', '#a855f7'),
('General Discussion', 'general', 'Miscellaneous topics', '#6b7280');
```

### Posts
```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id),
    post_type VARCHAR(20) NOT NULL CHECK (post_type IN ('question', 'information', 'opinion', 'knowledge')),
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    tags VARCHAR(50)[],
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    view_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edited_at TIMESTAMP
);

CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
```

### Comments
```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    author_id INT REFERENCES users(id) ON DELETE SET NULL,
    parent_comment_id INT REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    is_accepted_answer BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
```

### Votes
```sql
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    votable_type VARCHAR(20) NOT NULL CHECK (votable_type IN ('post', 'comment')),
    votable_id INT NOT NULL,
    vote_value INT CHECK (vote_value IN (-1, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, votable_type, votable_id)
);

CREATE INDEX idx_votes_votable ON votes(votable_type, votable_id);
CREATE INDEX idx_votes_user ON votes(user_id);
```

### Messages
```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) ON DELETE SET NULL,
    recipient_id INT REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(200),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted_by_sender BOOLEAN DEFAULT FALSE,
    is_deleted_by_recipient BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
```

### Notifications
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

### Follows
```sql
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES users(id) ON DELETE CASCADE,
    following_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
```

### Reports
```sql
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    reporter_id INT REFERENCES users(id) ON DELETE SET NULL,
    reportable_type VARCHAR(20) NOT NULL CHECK (reportable_type IN ('post', 'comment', 'user')),
    reportable_id INT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
    reviewed_by INT REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reportable ON reports(reportable_type, reportable_id);
```

### Moderation Actions
```sql
CREATE TABLE moderation_actions (
    id SERIAL PRIMARY KEY,
    moderator_id INT REFERENCES users(id),
    target_user_id INT REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    reason TEXT,
    duration INT, -- In days, for temporary actions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Job Postings
```sql
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    posted_by INT REFERENCES users(id),
    category_id INT REFERENCES categories(id),
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    company_name VARCHAR(255),
    location VARCHAR(200),
    employment_type VARCHAR(50),
    salary_range VARCHAR(100),
    application_url VARCHAR(500),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Consulting Sessions
```sql
CREATE TABLE consulting_sessions (
    id SERIAL PRIMARY KEY,
    expert_id INT REFERENCES users(id),
    client_id INT REFERENCES users(id),
    category_id INT REFERENCES categories(id),
    title VARCHAR(300),
    description TEXT,
    status VARCHAR(20) DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'declined', 'completed', 'cancelled')),
    scheduled_at TIMESTAMP,
    duration INT, -- In minutes
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Audit Logs
```sql
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    changes JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

## Key Relationships

- Users can create multiple Posts and Comments
- Posts belong to one Category and have many Comments
- Comments can have nested replies (parent_comment_id)
- Votes are polymorphic (can vote on Posts or Comments)
- Users can Follow other Users
- Users can Report Posts, Comments, or other Users
- Expert Verifications link to Users and Categories
- Messages are between two Users
- Notifications belong to Users

## Indexes for Performance

- Primary keys on all tables
- Foreign key indexes
- Composite indexes for common queries
- GIN index for array fields (tags)
- Time-based indexes for sorting
