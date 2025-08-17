'use client'

import React from 'react'
import { Button } from '../ui/button'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ChatButton({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleChat = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("roomId", id)

    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <Button
      className="px-4 py-1 cursor-pointer"
      variant="default"
      onClick={handleChat}
    >
      Chat
    </Button>
  )
}
