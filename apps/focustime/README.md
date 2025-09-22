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
VITE_OAUTH_CLIENT_ID=037610c0-6f9a-4242-bdc3-3e3966b4a49b
VITE_TASKFLOW_SUPABASE_AUTH_URL=https://dcadjrdcyeuocwxbjeux.supabase.red/auth/v1

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

## 🔧 Technology Stack

- **Framework**: Vite + React 18
- **Router**: React Router DOM
- **OAuth**: Full OAuth 2.1 client with PKCE
- **State Management**: React Context + Custom Hooks
- **Styling**: Tailwind CSS (purple/orange theme)
- **Notifications**: Custom toast system
- **TypeScript**: Full type safety

## 📱 Features

- 🍅 **Pomodoro Timer** - 25-minute focus sessions with 5-minute breaks
- 🔗 **TaskFlow Integration** - Select and work on imported tasks
- ✅ **Auto-completion** - Mark tasks complete after focus sessions
- 🎯 **Task Selection** - Choose from incomplete tasks
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔔 **Toast Notifications** - Success/error feedback
- 💫 **Smooth Animations** - Professional UI transitions

## 🔐 OAuth 2.1 Client Implementation

FocusTime implements a secure OAuth 2.1 client with:

- **Authorization Code Flow with PKCE** - Prevents code interception attacks
- **State Parameter** - CSRF protection during authorization
- **Secure Token Storage** - SessionStorage (not localStorage)
- **Token Expiry Handling** - Automatic cleanup and refresh
- **Scope Validation** - Requests specific permissions (`profile:read`, `tasks:read`, `tasks:write`)

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

## 🔄 OAuth Flow

1. **Authorization Request**: User clicks "Connect to TaskFlow"
2. **PKCE Generation**: Client generates code verifier and challenge
3. **Redirect to TaskFlow**: User authorizes requested scopes
4. **Code Exchange**: Client exchanges authorization code for access token
5. **API Access**: Client uses Bearer token to access TaskFlow APIs
6. **Task Sync**: User's tasks are imported and available for focus sessions

## 🎯 Pomodoro Integration

1. **Connect to TaskFlow**: Authenticate via OAuth 2.1
2. **Import Tasks**: View your incomplete tasks from TaskFlow
3. **Select Task**: Choose a task to focus on
4. **Start Timer**: 25-minute focus session begins
5. **Take Break**: 5-minute break after each session
6. **Mark Complete**: Optionally mark task as complete in TaskFlow

## 🔗 API Integration

FocusTime integrates with TaskFlow's protected APIs:

- **GET /api/user** - Fetch user profile
- **GET /api/tasks** - List user's tasks
- **PUT /api/tasks/[id]** - Mark tasks as complete

All requests use Bearer token authentication with appropriate OAuth scopes.

## 🚪 Security Features

- **PKCE (Proof Key for Code Exchange)** - Protects against authorization code interception
- **State Parameter** - Prevents CSRF attacks during OAuth flow
- **SessionStorage** - Secure token storage (cleared on tab close)
- **Token Expiry** - Automatic cleanup of expired tokens
- **Scope Validation** - Requests only necessary permissions

## 🎨 UI/UX Features

- **Purple/Orange Theme** - Distinctive branding separate from TaskFlow
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Toast Notifications** - Clear feedback for user actions
- **Loading States** - Smooth transitions during API calls
- **Error Handling** - Graceful error messages and recovery
