# TaskFlow - OAuth 2.1 Provider & Task Manager

A Next.js 14 application that serves as both a task management system and OAuth 2.1 authorization server, demonstrating secure authorization flows with PKCE, scope validation, and Bearer token authentication.

## 🚀 Quick Start

1. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. **Install dependencies and start development server**:
```bash
npm install
npm run dev
```

3. **Open the application**:
Visit [http://localhost:3000](http://localhost:3000) to access TaskFlow.

## 🛠️ Development

### Project Structure
```
app/
├── (auth)/              # Authentication routes
├── api/                 # API endpoints
│   ├── auth/           # OAuth endpoints
│   ├── tasks/          # Task management API
│   └── user/           # User profile API
├── dashboard/          # Main dashboard
└── layout.tsx          # Root layout
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Setup

Run the SQL migration in `supabase/migrations/001_tasks.sql` to set up the required tables and Row Level Security policies.

## 🌐 API Endpoints

### OAuth Endpoints
- `GET /api/auth/authorize` - Authorization endpoint
- `POST /api/auth/token` - Token exchange endpoint

### Protected API Endpoints
- `GET /api/user` - Get user profile
- `GET /api/tasks` - List user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

All protected endpoints require Bearer token authentication and appropriate scopes.

## 🔗 Integration

TaskFlow is designed to work with OAuth 2.1 clients like FocusTime. Clients can:

1. Redirect users to TaskFlow for authorization
2. Receive authorization codes with PKCE verification
3. Exchange codes for access tokens
4. Access user data and tasks via secure API endpoints

For a complete integration example, see the FocusTime client application in this monorepo.
