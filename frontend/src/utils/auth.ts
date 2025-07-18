// Simple token storage helpers
const TOKEN_KEY = 'access_token'

/** Save JWT access token */
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Retrieve JWT access token */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** Remove JWT access token */
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
