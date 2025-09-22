import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - TaskFlow',
  description: 'Sign in to your TaskFlow account',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}