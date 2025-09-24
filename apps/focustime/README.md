# FocusTime - OAuth 2.1 Client & Pomodoro Timer

A Vite + React application that demonstrates OAuth 2.1 client implementation with PKCE, featuring a Pomodoro timer that integrates with TaskFlow for secure task management.

## 🚀 Quick Start

1. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your TaskFlow integration settings:
```env
# TaskFlow OAuth Configuration
VITE_TASKFLOW_URL=http://localhost:3000
VITE_TASKFLOW_API_URL=http://localhost:3000/api
VITE_OAUTH_CLIENT_ID=<oauth-client-id>
VITE_TASKFLOW_SUPABASE_AUTH_URL=https://<ref>.supabase.co/auth/v1

# App Configuration
VITE_SITE_URL=http://localhost:3001
```

2. **Install dependencies and start development server**:
```bash
npm install
npm run dev
```

3. **Open the application**:
Visit [http://localhost:3001](http://localhost:3001) to access FocusTime.

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── timer/          # Pomodoro timer components
│   └── ui/             # UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── oauth/          # OAuth client implementation
│   └── api/            # API client
├── pages/              # Route components
└── contexts/           # React contexts
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔗 API Integration

FocusTime integrates with TaskFlow's protected APIs:

- **GET /api/user** - Fetch user profile
- **GET /api/tasks** - List user's tasks
- **PUT /api/tasks/[id]** - Mark tasks as complete

All requests use Bearer token authentication with appropriate OAuth scopes.
