'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type ChatUser = { name: string; username: string } | null

export default function ChatName({ user }: { user: ChatUser }) {
  const displayName = user?.name ?? "Unknown User"
  const username = user?.username ?? "unknown"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-3 select-none cursor-pointer"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {displayName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {displayName}
          </h2>
        </button>
      </TooltipTrigger>

      <TooltipContent>
        <p>@{username}</p>
      </TooltipContent>
    </Tooltip>
  )
}
