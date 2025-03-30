import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Get the origin from the request
  const origin = request.headers.get('origin') || ''

  // Check if the origin is allowed
  const allowedOrigins = [
    'http://localhost:5173',
    'https://cv.olektech.com'
  ]

  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: response.headers,
    })
  }

  return response
}

// Configure which routes to run middleware on
export const config = {
  matcher: '/api/:path*',
} 