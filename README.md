# TaskFlow & FocusTime - OAuth 2.1 Demo

A complete OAuth 2.1 implementation demonstrating secure authorization between a task management app (TaskFlow) and a Pomodoro timer app (FocusTime).

## 🚀 Quick Start

1. **Clone and install dependencies**:
```bash
git clone <your-repo-url>
cd supabase-auth-oauth2-demo
npm install
```

2. **Set up Supabase**:
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the database migration: copy/paste [`apps/taskflow/supabase/migrations/001_tasks.sql`](./apps/taskflow/supabase/migrations/001_tasks.sql) in SQL Editor
   - Configure authentication: disable email confirmations for testing
   - Add redirect URL: `http://localhost:3001/auth/callback`

3. **Configure environment variables**:
```bash
# TaskFlow (OAuth Provider) - copy and edit
cp apps/taskflow/.env.example apps/taskflow/.env.local

# FocusTime (OAuth Client) - copy and edit  
cp apps/focustime/.env.example apps/focustime/.env.local
```

4. **Start both applications**:
```bash
npm run dev
```

5. **Open the applications**:
   - TaskFlow: http://localhost:3000 (OAuth Provider)
   - FocusTime: http://localhost:3001 (OAuth Client)

## 📁 Project Structure

```
supabase-auth-oauth2-demo/
├── apps/
│   ├── taskflow/          # Next.js OAuth Provider & Task Manager
│   │   ├── src/app/       # Next.js 14 App Router
│   │   ├── supabase/      # Database migrations
│   │   └── package.json   # TaskFlow dependencies
│   │
│   └── focustime/         # Vite React OAuth Client & Pomodoro Timer
│       ├── src/           # React components and pages
│       └── package.json   # FocusTime dependencies
│
├── packages/              # Shared packages (configs, utils)
│   ├── eslint-config/     # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
│
├── turbo.json            # Turborepo pipeline configuration
└── package.json          # Root workspace configuration
```

## 🔧 Technology Stack

### TaskFlow (OAuth Provider)
- **Framework**: Next.js 14 with App Router
- **Authentication**: Supabase Auth with Row Level Security
- **Database**: PostgreSQL (via Supabase)
- **Styling**: Tailwind CSS
- **OAuth**: Custom OAuth 2.1 server implementation
- **API**: Next.js API routes with Bearer token validation

### FocusTime (OAuth Client)  
- **Framework**: Vite + React 18
- **Router**: React Router DOM
- **OAuth**: Full OAuth 2.1 client with PKCE
- **State Management**: React Context + Custom Hooks
- **Styling**: Tailwind CSS (purple/orange theme)
- **Notifications**: Custom toast system

### Shared
- **Monorepo**: Turborepo for efficient builds
- **TypeScript**: Full type safety across both apps
- **Linting**: ESLint with shared configuration
- **Package Manager**: npm workspaces

## 🔐 OAuth 2.1 Implementation

This project implements a **production-ready OAuth 2.1 authorization server** and client with the following security features:

### Security Features ✅
- **Authorization Code Flow with PKCE** - Prevents code interception attacks
- **State Parameter** - CSRF protection during authorization
- **Secure Token Storage** - SessionStorage (not localStorage)
- **Token Expiry Handling** - Automatic cleanup and refresh
- **Scope Validation** - Fine-grained permission control
- **Bearer Token Authentication** - Secure API access
- **Row Level Security** - Database-level access control

### OAuth Flow
1. **FocusTime** redirects user to **TaskFlow** authorization page
2. User reviews requested permissions and authorizes
3. **TaskFlow** redirects back with authorization code
4. **FocusTime** exchanges code for access token (with PKCE verification)
5. **FocusTime** uses token to access user's tasks via **TaskFlow** API

## 📱 Features

### TaskFlow Features
- 🔐 **User Registration & Login** with Supabase Auth
- ✅ **Task Management** - Create, edit, complete, delete tasks
- 🔄 **Real-time Updates** - Live task synchronization
- 🛡️ **OAuth Consent Flow** - Professional authorization interface
- 🌐 **REST API** - Secure endpoints with scope validation
- 📊 **Progress Tracking** - Task completion analytics

### FocusTime Features  
- 🍅 **Pomodoro Timer** - 25-minute focus sessions with 5-minute breaks
- 🔗 **TaskFlow Integration** - Select and work on imported tasks
- ✅ **Auto-completion** - Mark tasks complete after focus sessions
- 🎯 **Task Selection** - Choose from incomplete tasks
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🔔 **Toast Notifications** - Success/error feedback
- 💫 **Smooth Animations** - Professional UI transitions

## 🧪 Testing the Integration

Follow the [Integration Test Checklist](./integration-test.md) to verify the complete OAuth flow:

1. ✅ Register and login to TaskFlow
2. ✅ Create test tasks  
3. ✅ Initiate OAuth from FocusTime
4. ✅ Complete authorization on TaskFlow
5. ✅ Verify task sync in FocusTime
6. ✅ Complete focus session and mark task done
7. ✅ Verify task marked complete in TaskFlow

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start both apps in development
npm run build        # Build both apps for production  
npm run lint         # Lint all packages

# Individual apps
npm run dev:taskflow    # Start only TaskFlow
npm run dev:focustime   # Start only FocusTime
```

### Environment Configuration

Configure each app with your Supabase credentials:

#### TaskFlow (`apps/taskflow/.env.local`)
Full Supabase access - OAuth Provider needs complete access:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### FocusTime (`apps/focustime/.env.local`)
OAuth Client configuration with TaskFlow integration:

```env
# TaskFlow OAuth Configuration
VITE_TASKFLOW_URL=http://localhost:3000
VITE_TASKFLOW_API_URL=http://localhost:3000/api
VITE_OAUTH_CLIENT_ID=037610c0-6f9a-4242-bdc3-3e3966b4a49b
VITE_TASKFLOW_SUPABASE_AUTH_URL=https://your-project.supabase.co/auth/v1

# App Configuration
VITE_SITE_URL=http://localhost:3001
```

> **Security Note**: FocusTime uses the specific Supabase Auth URL for OAuth token exchange rather than direct Supabase client access.

## 🚀 Deployment

### Production Considerations

1. **Update redirect URLs** in your OAuth configuration
2. **Enable email confirmations** in Supabase
3. **Use HTTPS** for all production URLs
4. **Set secure environment variables** 
5. **Configure proper CORS** headers
6. **Enable rate limiting** for OAuth endpoints
7. **Set up monitoring** and error tracking

### Deployment Platforms
- **Vercel** (recommended for Next.js)
- **Netlify** 
- **AWS Amplify**
- **Heroku**
- **Railway**

## 🧩 Architecture Decisions

### Why This Stack?
- **Next.js**: Server-side rendering, API routes, excellent DX
- **Supabase**: Managed PostgreSQL, built-in auth, RLS
- **React**: Component-based UI, great ecosystem
- **Turborepo**: Efficient monorepo builds and caching
- **TypeScript**: Type safety reduces runtime errors

### OAuth 2.1 vs 2.0
This implementation uses OAuth 2.1, which includes:
- **Mandatory PKCE** for public clients
- **Removed implicit flow** (security improvement)
- **Enhanced security guidance** 
- **Better mobile app support**

## 🐛 Troubleshooting

### Common Issues

**OAuth redirect errors**
- Verify redirect URIs in Supabase match exactly
- Check that both apps are running on correct ports

**CORS errors**  
- Ensure API requests go to localhost during development
- Check CORS configuration in production

**Tasks not syncing**
- Verify authentication tokens are valid
- Check browser network tab for API errors
- Ensure user has created tasks in TaskFlow

**Build errors**
- Clear node_modules and reinstall dependencies
- Check TypeScript configuration
- Verify environment variables are set

### Debug Mode
Set `NODE_ENV=development` to enable:
- Detailed error messages
- OAuth flow logging
- API request/response logging

## 📚 Additional Resources

- [Database Setup](./apps/taskflow/supabase/migrations/001_tasks.sql) - SQL migration file
- [Integration Testing](./integration-test.md) - Complete testing checklist
- [Demo Script](./DEMO.md) - Walkthrough for demonstrations
- [Supabase Documentation](https://supabase.com/docs)
- [OAuth 2.1 RFC](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-07)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ to demonstrate secure OAuth 2.1 implementation between modern web applications.**