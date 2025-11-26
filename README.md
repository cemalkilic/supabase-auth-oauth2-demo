# TaskFlow & FocusTime - OAuth 2.1 Demo

A complete Supabase OAuth 2.1 implementation demonstrating secure authorization between a task management app (TaskFlow) and a Pomodoro timer app (FocusTime).

## 🎥 Demo Video

https://github.com/user-attachments/assets/93821364-ac42-433c-8779-f6e4b6445b7e

## 🚨 **DEMO ONLY - NOT FOR PRODUCTION** 🚨

**⚠️ WARNING: This repository is for demonstration and learning purposes only!**

- 🧪 **95% vibe coded** - Built for educational value, not production reliability
- 🚫 **DO NOT use in production workloads** - Missing production-level error handling, and optimizations
- 📚 **Educational tool** - Perfect for learning OAuth 2.1 flows and Supabase integration patterns
- 🛠️ **Development reference** - Use concepts and patterns, but rebuild properly for production

## 🚀 Quick Start

1. **Clone and install dependencies**:
```bash
git clone <your-repo-url>
cd supabase-auth-oauth2-demo
npm install
```

2. **Set up Supabase**:

   ### Option A: Local Development (Recommended)
   
   **Prerequisites**: Install the Supabase CLI following the [official installation guide](https://supabase.com/docs/guides/cli/getting-started#installing-the-supabase-cli).
   
   Run Supabase locally for easy development:
   
   ```bash
   # Navigate to TaskFlow directory
   cd apps/taskflow
   
   # Start local Supabase instance
   supabase start
   ```
   
   After running `supabase start`, copy the **API URL** and **publishable key** from the CLI output and use them in your environment variables.
   
   ### Option B: Cloud Supabase
   
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - **Important**: Ensure your project is on auth version **v2.180.0** or above for OAuth 2.1 support
   - Run the database migration: copy/paste [`apps/taskflow/supabase/migrations/001_tasks.sql`](./apps/taskflow/supabase/migrations/001_tasks.sql) in SQL Editor
   - Configure authentication: disable email confirmations for testing
   - **Create OAuth client** using your Supabase project API:
     
     ```bash
     curl --request POST \
       --url https://<ref>.supabase.co/auth/v1/admin/oauth/clients \
       --header 'Apikey: <ANON_KEY>' \
       --header 'Authorization: Bearer <SERVICE_ROLE_KEY>' \
       --header 'Content-Type: application/json' \
       --data '{
       "client_name": "FocusTime",
       "redirect_uris": ["http://localhost:3001/auth/callback"],
       "client_uri": "http://localhost:3001",
       "grant_types": ["authorization_code", "refresh_token"],
       "client_type": "public"
     }'
     ```
     
     **Important**: Save the `client_id` from the response - you'll need it for the FocusTime environment configuration.

3. **Configure environment variables**:
```bash
# TaskFlow (OAuth Provider) - copy and edit
cp apps/taskflow/.env.example apps/taskflow/.env.local

# FocusTime (OAuth Client) - copy and edit  
cp apps/focustime/.env.example apps/focustime/.env.local

# Update VITE_OAUTH_CLIENT_ID with the client_id from step 2
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
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### FocusTime (`apps/focustime/.env.local`)
OAuth Client configuration with TaskFlow integration:

```env
# TaskFlow OAuth Configuration
VITE_TASKFLOW_URL=http://localhost:3000
VITE_TASKFLOW_API_URL=http://localhost:3000/api
VITE_OAUTH_CLIENT_ID=<client_id_from_oauth_client_creation>
VITE_TASKFLOW_SUPABASE_AUTH_URL=https://<ref>.supabase.co/auth/v1

# App Configuration
VITE_SITE_URL=http://localhost:3001
```

> **Important**: Replace `<client_id_from_oauth_client_creation>` with the actual `client_id` returned from the OAuth client creation API call in the Supabase setup step, and `<ref>` with your Supabase project reference.

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
