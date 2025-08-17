// Utility functions for authentication
export interface User {
  id: string
  email: string
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

// API base URL - adjust this to match your Express.js backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

export async function sendPostRequest(endpoint: string, data: any): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Request failed")
  }

  return response.json()
}

export async function sendAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      clearToken()
      window.location.href = "/login"
      return
    }
    const error = await response.json()
    throw new Error(error.message || "Request failed")
  }

  return response.json()
}

export function setToken(token: string) {
  // Store in localStorage for client-side access
  localStorage.setItem("token", token)

  // Also set as httpOnly cookie for server-side middleware
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function clearToken() {
  localStorage.removeItem("token")
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
