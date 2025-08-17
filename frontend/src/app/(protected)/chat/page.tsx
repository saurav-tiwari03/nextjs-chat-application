"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserTab from "@/components/molecules/UserTab";
import NotificationsTab from "@/components/molecules/NotificationsTab";
import { sendProtectedGetRequest } from "@/utils/SendRequest";
import ChatName from "@/components/atoms/ChatName";
import type { User } from "@/app/interface";
import { Send } from "lucide-react";
import SearchUser from "@/components/molecules/SearchUser";

type Msg = {
  _id: string;
  text: string;
  from: string;   // userId
  to: string;     // userId
  createdAt: string;
};

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [user, setUser] = useState<User | null>(null);
  const [otherUser, setOtherUser] = useState<{ name: string; username: string; email: string; id: string } | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);

  const socketRef = useRef<Socket | null>(null);

  // 1) Connect socket once
  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5004", {
      transports: ["websocket"],
      query: { token }, // you can switch to auth: { token } if you also update the server
    });

    socketRef.current = s;

    s.on("connect", () => {
      setSocketId(s.id!);
      toast.success(`Connected: ${s.id}`);
    });

    s.on("reply", (d) => {
      // optional toast
      // toast.info(d.text);
    });

    // live single-message updates
    s.on("message:new", (msg: Msg) => {
      setMessages((prev) => (prev.some(m => m._id === msg._id) ? prev : [...prev, msg]));
    });

    // initial (and reload) history
    s.on("all_messages", ({ data }: { data: Msg[] }) => {
      setMessages(data);
    });

    s.on("disconnect", () => setSocketId(""));

    return () => {
      s.off("connect");
      s.off("reply");
      s.off("message:new");
      s.off("all_messages");
      s.off("disconnect");
      s.close();
    };
  }, []);

  // 2) Load current user + other user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const userId = searchParams.get("roomId");
    const token = localStorage.getItem("token") || "";
    if (userId && token) {
      (async () => {
        const res = await sendProtectedGetRequest(`/user/${userId}`, token);
        setOtherUser(res?.data ?? null);
      })();
    } else {
      setOtherUser(null);
    }
  }, [searchParams]);

  // 3) Fetch history when both ids are ready and socket connected
  useEffect(() => {
    if (!user?.id || !otherUser?.id || !socketRef.current) return;
    socketRef.current.emit("get_all_messages", { from: user.id, to: otherUser.id, limit: 200 });
  }, [user?.id, otherUser?.id]);

  const sendMessage = () => {
    if (!otherUser?.id) return toast.error("Select a user first");
    if (!message.trim()) return toast.error("Message cannot be empty");

    socketRef.current?.emit("private_message", { text: message, to: otherUser.id });
    setMessage(""); // optimistic clear; "message:new" echo will append to UI
  };

  const isMine = (m: Msg) => m.from === user?.id;

  return (
    <main className="h-screen bg-gradient-to-b from-black to-zinc-900 px-4 py-4 text-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left: Search Users */}
        <aside className="md:col-span-1">
          <SearchUser onSelectUser={setSelectedUser} />
        </aside>

        <section className="md:col-span-2">
          <Card className="h-full border border-white/10 bg-zinc-900 shadow-xl">
            <CardHeader className="flex flex-col items-center space-y-2">
              <div className="flex w-full justify-end items-center gap-2">
                <NotificationsTab />
                <UserTab user={{ name: user?.name, avatarUrl: user?.avatarUrl }} />
              </div>
              <div className="flex items-start w-full">{otherUser && <ChatName user={otherUser} />}</div>
              <p className="text-xs text-zinc-500">Socket: {socketId || "…"} </p>
            </CardHeader>

            <CardContent className="flex flex-col h-[500px] justify-between space-y-4">
              {/* history */}
              <div className="flex-1 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 text-sm">
                {messages.length === 0 ? (
                  <p className="text-center text-zinc-500">No messages yet</p>
                ) : (
                  <ul className="space-y-2">
                    {messages.map((m) => (
                      <li key={m._id} className={`flex ${isMine(m) ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-md px-3 py-2 ${
                            isMine(m) ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-100"
                          }`}
                          title={new Date(m.createdAt).toLocaleString()}
                        >
                          {m.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* composer */}
              <div className="flex gap-2 items-start">
                <Input
                  placeholder="Type your message..."
                  className="w-full border-white/10 bg-black/50 text-white placeholder:text-zinc-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} variant="outline" className="flex items-center gap-2 border-white/20 bg-white/5">
                  <Send className="h-4 w-4" /> Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
