import { Suspense } from 'react'
import ConsentPageClient from '@/components/oauth/ConsentPageClient'
import ConsentLoading from './loading'
import type { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Authorize App - TaskFlow',
  description: 'Grant access to your TaskFlow account',
}

interface ConsentPageProps {
  searchParams: Promise<{
    authorization_id?: string
    client_id?: string
    redirect_uri?: string
    scope?: string
    state?: string
    code_challenge?: string
    code_challenge_method?: string
  }>
}

export default function ConsentPage({ searchParams }: ConsentPageProps) {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto">
        <Suspense fallback={<ConsentLoading />}>
          <ConsentPageClient searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}