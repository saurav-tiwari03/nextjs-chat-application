"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      setAuthenticated(authStatus)
      setIsLoading(false)

      if (!authStatus) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return fallback || <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
