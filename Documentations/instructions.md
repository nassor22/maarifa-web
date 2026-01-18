# MaarifaHub
## Master AI Prompt for Building the Platform

---

## Role & Responsibility

You are a **senior full-stack software architect, AI engineer, and civic-tech product designer** tasked with designing and building **MaarifaHub**, a trusted African knowledge, expert-verification, and community discussion platform.

The system must be **production-ready**, scalable, ethical, and optimized for **low-bandwidth environments** common across Africa.

---

## Platform Purpose

MaarifaHub exists to solve a core problem in the digital era:

> The widespread availability of misinformation and unverified “experts” on social media, especially in sensitive fields such as health, finance, education, law, and technology.

The platform connects **verified experts** with **community members** to enable:
- Accurate knowledge sharing
- Professional guidance
- Counseling and consulting (non-emergency)
- Informed decision-making
- Constructive, moderated dialogue

---

## Core Principles

- **Trust first**: Expertise must be verified
- **Community driven**: Everyone can participate respectfully
- **Transparency**: Reputation and credibility are visible
- **Ethics and safety**: No harmful or illegal content
- **Accessibility**: Works on low bandwidth and mobile devices
- **Scalability**: Designed to grow across Africa

---

## System Scope

### In Scope
- Web-based platform
- User accounts and authentication
- Expert verification system
- Discussion forums
- Knowledge posts
- Voting and reputation system
- Direct messaging and notifications
- Job and career postings
- Premium one-on-one consulting (non-transactional MVP)

### Out of Scope
- Emergency services
- Financial transactions
- Legal representation
- Political campaigning or extremism
- Adult or explicit content
- Guaranteed professional outcomes

---

## User Roles

1. **Community Member**
   - Ask questions
   - Share opinions and information
   - Vote and engage
   - Earn white star reputation

2. **Verified Expert (Individual)**
   - Provide professional guidance
   - Publish knowledge posts
   - Earn gold star reputation
   - Participate in consulting (premium)

3. **Verified Expert (Organization)**
   - Publish organizational expertise
   - Post jobs and opportunities
   - Provide verified guidance

4. **Moderator**
   - Review content and reports
   - Enforce platform rules

5. **System Admin**
   - System configuration
   - Auditing and analytics
   - No content editing powers

---

## Categories Structure

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
- One-on-One Consulting (Premium)
- General Discussion

---

## Content Types

Each post must belong to **one category** and **one post type**:

- **QUESTION** – Requesting information (Green)
- **INFORMATION** – Sharing factual updates (Purple)
- **OPINION** – Personal views or experiences (Blue)
- **KNOWLEDGE** – Expert-only educational content (Gold)

---

## Functional Requirements

### User Registration & Authentication
- Email or phone number signup
- Username and password
- Role selection during registration
- Secure authentication

### Expert Verification
- Credential submission
- Education and certification upload
- Manual review workflow
- Verification badge on approval

### Discussion Forum
- Create, edit, and comment on posts
- Nested replies
- Category and tag selection
- Visibility rules by role

### Voting & Reputation System
- Upvoting posts and comments
- Weighted scoring system
- Star ratings:
  - Gold stars (verified experts)
  - White stars (community members)
- Reputation thresholds unlock visibility and features

### Messaging & Notifications
- Direct messages between users
- Follow users and topics
- Real-time and email notifications

### Moderation & Reporting
- Community reporting tools
- Moderator dashboards
- Content flagging and review
- User warnings and suspensions

---

## Monetization (Phase-Aware)

- Sponsored posts (clearly labeled)
- Ethical advertising
- Job posting fees
- Premium subscriptions
- Affiliate partnerships
- Optional donations

---

## Technical Constraints

- Web-first (no mobile apps for MVP)
- Mobile-friendly and low-bandwidth optimized
- Secure authentication and authorization
- Scalable backend architecture

### Preferred Stack
- Backend: Django (Python) or Laravel (PHP)
- Database: PostgreSQL
- Frontend: HTML, CSS, JavaScript (React optional)
- Hosting: Cloud or VPS
- APIs: REST or GraphQL

---

## Security & Privacy Requirements

- HTTPS everywhere
- Role-based access control
- Password hashing
- Data encryption
- Audit logs
- GDPR-aware data handling principles

---

## Deliverables

Produce the following in order:

1. High-level system architecture
2. Database schema and relationships
3. API design and endpoints
4. Authentication and authorization flow
5. Reputation and voting logic
6. Moderation workflow
7. Frontend UI structure
8. Sample backend and frontend code
9. Deployment and scaling strategy
10. Assumptions and limitations

---

## Important Instructions

- Do NOT overengineer
- Do NOT add features outside scope
- Focus on clarity and real-world usability
- Assume real users across Africa
- Prioritize trust, moderation, and performance

---

## Output Style

- Step-by-step
- Clear headings
- Production-oriented
- Minimal fluff
- Code where appropriate

---

**Begin designing and building MaarifaHub now.**
