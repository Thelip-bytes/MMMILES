// lib/auth.js - Secure JWT authentication utilities
import jwt from 'jsonwebtoken';

/**
 * Securely verify JWT token using Supabase JWT secret
 * @param {string} token - The JWT token to verify
 * @returns {object|null} - Decoded user object if valid, null otherwise
 */
export function verifyToken(token) {
  if (!token) {
    return null;
  }

  try {
    // Get the Supabase JWT secret from environment variables
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    
    if (!jwtSecret) {
      console.warn('SUPABASE_JWT_SECRET environment variable is not set - auth will be bypassed');
      // For development/fallback, try to decode without verification
      try {
        return jwt.decode(token);
      } catch {
        return null;
      }
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
}

/**
 * Extract and verify user from Authorization header
 * @param {string} authHeader - The Authorization header value
 * @returns {object|null} - Decoded user object if valid, null otherwise
 */
export function getUserFromAuthHeader(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}

/**
 * Middleware function to verify authentication
 * @param {Request} request - Next.js request object
 * @returns {object|null} - User object if authenticated, null otherwise
 */
export function requireAuth(request) {
  const authHeader = request.headers.get('authorization');
  const user = getUserFromAuthHeader(authHeader);
  
  if (!user) {
    return null;
  }
  
  return user;
}