/**
 * Lightweight, zero-dependency JWT utility compatible with Edge runtime, Node.js, and browser.
 */

/**
 * Safely decodes a base64url string into a UTF-8 string.
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Parses and returns the JSON payload from a JWT token.
 * Returns null if the token is invalid or cannot be decoded.
 */
export function parseJwtPayload(token: string | null | undefined): Record<string, any> | null {
  if (!token || typeof token !== 'string') return null;

  const trimmed = token.trim();
  const parts = trimmed.split('.');
  if (parts.length !== 3) return null;

  try {
    const jsonStr = base64UrlDecode(parts[1]);
    const payload = JSON.parse(jsonStr);
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Validates that a token:
 * 1. Is a non-empty string and not a literal dummy string ("undefined", "null", "false", etc.)
 * 2. Has valid 3-part JWT structure (header.payload.signature)
 * 3. Contains a valid JSON payload
 * 4. Is not expired (if 'exp' claim is present)
 */
export function isValidJwtToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;

  const trimmed = token.trim();
  if (trimmed.length < 10) return false;

  // Reject common dummy or serialized falsy strings
  const lower = trimmed.toLowerCase();
  if (
    lower === 'undefined' ||
    lower === 'null' ||
    lower === 'false' ||
    lower === 'true' ||
    lower === '[object object]' ||
    lower === 'none' ||
    lower === 'bearer'
  ) {
    return false;
  }

  // Check 3-part structure
  const parts = trimmed.split('.');
  if (parts.length !== 3) return false;
  if (!parts[0] || !parts[1] || !parts[2]) return false;

  // Validate payload
  const payload = parseJwtPayload(trimmed);
  if (!payload) return false;

  // Check expiration if 'exp' exists (exp is in seconds in standard JWTs)
  if (typeof payload.exp === 'number') {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    // Token is expired if exp is in the past
    if (payload.exp <= nowInSeconds) {
      return false;
    }
  }

  return true;
}
