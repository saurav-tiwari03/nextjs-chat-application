"use client"

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, Send, Link2 } from "lucide-react";
import SearchUser from "@/components/molecules/SearchUser";
import UserTab from "@/components/molecules/UserTab";
import { User } from "@/app/interface";
import NotificationsTab from "@/components/molecules/NotificationsTab";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5004");

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [socketId, setSocketId] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    if (localStorage.getItem("user")) {
      setUser(JSON.parse(localStorage.getItem("user")!));
    }

    socket.on("connect", () => {
      setSocketId(socket.id!);
      toast.success(`Connected to server: ${socket.id}`);
    });

    socket.on("reply", (data) => {
      toast.info(`${data.text}`);
    });

    socket.on("allUsers", (users) => {
      setAllUsers(users);
    });

    return () => {
      socket.off("connect");
      socket.off("reply");
      socket.off("allUsers");
    };
  }, []);

  const sendMessage = () => {
    if (!selectedUser) {
      toast.error("Please select a user first");
      return;
    }
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    socket.emit("private_message", { text: message, to: selectedUser });
    toast.success(`Message sent to ${selectedUser}`);
    setMessage("");
  };

  return (
    <main className="h-screen bg-gradient-to-b from-black to-zinc-900 px-4 py-4 text-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left: Search Users */}
        <aside className="md:col-span-1">
          <SearchUser onSelectUser={setSelectedUser} />
        </aside>

        {/* Right: Chat Panel */}
        <section className="md:col-span-2">
          <Card className="h-full border border-white/10 bg-zinc-900 shadow-xl">
            <CardHeader className="flex flex-col items-center space-y-2">
              <div className="flex w-full justify-between items-center">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  SauravGo Chat
                </CardTitle>
                <div className="flex gap-2 items-center">
                  <NotificationsTab />
                  <UserTab user={{ name: user?.name, avatarUrl: user?.avatarUrl }} />
                </div>
              </div>
              <p className="text-sm text-zinc-400">Socket ID: {socketId}</p>
            </CardHeader>

            <CardContent className="flex flex-col h-[500px] justify-between space-y-4">
              {/* Chat area (placeholder for history) */}
              <div className="flex-1 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">
                <p className="text-center text-zinc-500">No messages yet</p>
              </div>

              {/* Input + Send */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Type your message here..."
                  className="w-full resize-none border-white/10 bg-black/50 text-white placeholder:text-zinc-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <div className="flex items-center justify-between gap-3">
                  <Select
                    value={selectedUser}
                    onValueChange={(value) => setSelectedUser(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={sendMessage}
                    variant="outline"
                    className="flex items-center gap-2 border-white/20 bg-white/5 text-white hover:bg-zinc-800"
                  >
                    <Send className="h-4 w-4" /> Send
                  </Button>
                </div>
              </div>

              {/* Online Users */}
              {allUsers.length > 0 && (
                <div className="mt-2 rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-zinc-300">
                  <div className="mb-2 flex items-center gap-2 text-zinc-400">
                    <Users className="h-4 w-4" /> Online Users
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    {allUsers.map((user) => (
                      <li
                        key={user}
                        className={`cursor-pointer rounded-md px-2 py-1 text-xs ${user === selectedUser
                            ? "bg-zinc-700 text-white"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        {user}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
