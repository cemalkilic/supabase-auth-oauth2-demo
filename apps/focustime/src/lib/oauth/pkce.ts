/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.1
 * Uses Web Crypto API for secure random generation
 */

/**
 * Generate a cryptographically secure code verifier
 * @returns Base64 URL-encoded code verifier (43-128 characters)
 */
export async function generateCodeVerifier(): Promise<string> {
  // Generate 32 random bytes (256 bits)
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  
  // Convert to base64url format
  return base64URLEncode(array)
}

/**
 * Generate a code challenge from a code verifier using SHA256
 * @param verifier The code verifier string
 * @returns Base64 URL-encoded code challenge
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  // Encode verifier as UTF-8
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  
  // Hash with SHA256
  const digest = await crypto.subtle.digest('SHA-256', data)
  
  // Convert to base64url format
  return base64URLEncode(new Uint8Array(digest))
}

/**
 * Convert ArrayBuffer to base64url encoding
 * @param buffer The buffer to encode
 * @returns Base64 URL-encoded string
 */
function base64URLEncode(buffer: Uint8Array): string {
  // Convert to base64
  const base64 = btoa(String.fromCharCode(...buffer))
  
  // Convert to base64url by replacing characters and removing padding
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Generate both code verifier and challenge
 * @returns Object containing verifier and challenge
 */
export async function generatePKCEPair(): Promise<{
  verifier: string
  challenge: string
}> {
  const verifier = await generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  
  return { verifier, challenge }
}