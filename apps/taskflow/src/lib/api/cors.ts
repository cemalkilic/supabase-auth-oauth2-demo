import { NextRequest } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3001', // FocusTime development
]

export function getCorsHeaders(origin?: string) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400', // 24 hours
  }

  // Check if origin is allowed
  if (origin && (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development')) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
  } else {
    // Fallback for development
    if (process.env.NODE_ENV === 'development') {
      headers['Access-Control-Allow-Origin'] = '*'
    }
  }

  return headers
}

export function handleCors(request: NextRequest) {
  const origin = request.headers.get('Origin')
  const corsHeaders = getCorsHeaders(origin || undefined)

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  return corsHeaders
}

export function createCorsResponse(data: any, status: number = 200, request?: NextRequest) {
  const corsHeaders = request ? handleCors(request) : getCorsHeaders()
  
  // Handle the case where handleCors returns a Response for OPTIONS
  if (corsHeaders instanceof Response) {
    return corsHeaders
  }
  
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...(corsHeaders as Record<string, string>),
      },
    }
  )
}

export function createCorsErrorResponse(message: string, status: number = 400, request?: NextRequest) {
  const corsHeaders = request ? handleCors(request) : getCorsHeaders()
  
  // Handle the case where handleCors returns a Response for OPTIONS
  if (corsHeaders instanceof Response) {
    return corsHeaders
  }
  
  return new Response(
    JSON.stringify({
      error: {
        message,
        code: status,
        timestamp: new Date().toISOString()
      }
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...(corsHeaders as Record<string, string>),
      },
    }
  )
}