"use client"

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// 📨 Chat notification shape
type ChatNotification = {
  id: string;
  from: string; // socketId or username
  preview: string; // short text
  time: string; // ISO or human
  href?: string; // deep link to chat
  unread?: boolean;
};

// 🔔 Monochrome Notifications Tab (Dropdown)
export default function NotificationsTab({
  initialNotifications,
}: {
  initialNotifications?: ChatNotification[];
}) {
  // Constant demo data if not provided
  const demo: ChatNotification[] = useMemo(
    () => [
      {
        id: "1",
        from: "saurav@1234",
        preview: "Hey! Are you online?",
        time: "17:10",
        href: "/chat?user=saurav@1234",
        unread: true,
      },
      {
        id: "2",
        from: "neha@5577",
        preview: "Sent you the design mock.",
        time: "16:42",
        href: "/chat?user=neha@5577",
        unread: true,
      },
      {
        id: "3",
        from: "system",
        preview: "You are now connected to the server.",
        time: "16:00",
        href: "/chat",
        unread: false,
      },
    ],
    []
  );

  const [items, setItems] = useState<ChatNotification[]>(
    initialNotifications?.length ? initialNotifications : demo
  );

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));

  const clearAll = () => setItems([]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Toggle notifications"
          className="cursor-pointer relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-200 outline-none transition hover:bg-zinc-800"
        >
          <Bell className="h-5 w-5" />
          <Badge
            variant="secondary"
            className="pointer-events-none absolute -right-1 -top-1 h-5 min-w-[1.25rem] justify-center rounded-full bg-zinc-200 px-1 text-xs font-medium text-black"
          >
            {unreadCount}
          </Badge>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 border-white/10 bg-zinc-950 text-zinc-100">
        <DropdownMenuLabel className="flex items-center justify-between text-zinc-200">
          <span>Notifications</span>
          {items.length > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />

        {items.length === 0 ? (
          <div className="p-6 text-center text-sm text-zinc-500">No notifications!</div>
        ) : (
          <ScrollArea className="max-h-72">
            <ul className="py-1">
              {items.map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  asChild
                  className={`cursor-pointer gap-3 rounded-md px-3 py-2 hover:bg-zinc-900 ${
                    n.unread ? "bg-white/5" : "bg-transparent"
                  }`}
                >
                  <Link href={n.href || "/chat"} className="flex w-full items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-200">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-zinc-200">{n.from}</p>
                        <span className="ml-2 shrink-0 text-[11px] text-zinc-400">{n.time}</span>
                      </div>
                      <p className="truncate text-xs text-zinc-400">{n.preview}</p>
                    </div>
                    {n.unread && (
                      <span className="ml-2 mt-1 inline-block h-2 w-2 rounded-full bg-zinc-200" />
                    )}
                  </Link>
                </DropdownMenuItem>
              ))}
            </ul>
          </ScrollArea>
        )}

        <DropdownMenuSeparator className="bg-white/10" />
        <div className="flex items-center justify-between p-2">
          <Link
            href="/chat"
            className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            View all
          </Link>
          <button
            onClick={clearAll}
            className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            Clear
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
