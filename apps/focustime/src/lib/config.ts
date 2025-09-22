export const config = {
  supabase: {
    url: import.meta.env.VITE_TASKFLOW_SUPABASE_AUTH_URL,
  },
  taskflow: {
    url: import.meta.env.VITE_TASKFLOW_URL,
    apiUrl: import.meta.env.VITE_TASKFLOW_API_URL,
  },
  oauth: {
    clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
    redirectUri: `${import.meta.env.VITE_SITE_URL}/auth/callback`,
    scopes: ['profile:read', 'tasks:read', 'tasks:write'],
  },
  app: {
    name: 'FocusTime',
    tagline: 'Stay focused with Pomodoro technique',
    url: import.meta.env.VITE_SITE_URL,
  },
} as const

export type Config = typeof config