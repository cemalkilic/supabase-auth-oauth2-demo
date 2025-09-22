export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  app: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
  },
} as const

export type Config = typeof config