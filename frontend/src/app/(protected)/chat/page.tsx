"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Send } from "lucide-react";
import SearchUser from "@/components/molecules/SearchUser";
import UserTab from "@/components/molecules/UserTab";
import { User } from "@/app/interface";
import NotificationsTab from "@/components/molecules/NotificationsTab";
import { sendProtectedGetRequest } from '@/utils/SendRequest';
import ChatName from '@/components/atoms/ChatName';
import { SendPrivateMessage } from '@/socket/PrivateChat/PrivateMessage';

type Msg = {
  _id: string;
  text: string;
  from: string;   // userId
  to: string;     // userId
  createdAt: string;
};

const token = localStorage.getItem("token");
const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5004"}?token=${token}`);

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [, setSelectedUser] = useState("");
  const [otherUser, setOtherUser] = useState<{ name: string, username: string, email: string, id: string } | null>(null);
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Load current user & set up socket listeners (once)
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    const onConnect = () => {
      toast.success(`Connected to server: ${socket.id}`);
    };
    const onPrivateMessage = (msg: Msg) => {
      console.log("New private message received:", msg);
      toast.message(`@${msg.from}`, { description: `New message : ${msg.text}` });
      setMessages(prev => [...prev, msg]);
    };

    socket.on("connect", onConnect);
    socket.on("privateMessage", onPrivateMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("privateMessage", onPrivateMessage);
    };
  }, []);

  // Fetch the "other user" when roomId changes
  useEffect(() => {
    const userId = searchParams.get("roomId");
    if (!userId) {
      setOtherUser(null);
      return;
    }
    (async () => {
      try {
        const tk = localStorage.getItem("token") ?? "";
        const response = await sendProtectedGetRequest(`/user/${userId}`, tk);
        setOtherUser(response?.data ?? null);
      } catch (e) {
        console.error(e);
        setOtherUser(null);
      }
    })();
  }, [searchParams]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    if (!otherUser?.id) {
      toast.error("No recipient selected.");
      return;
    }
    if (!user?.id) {
      toast.error("User not loaded.");
      return;
    }

    // send to server
    SendPrivateMessage(socket, otherUser.id, trimmed);

    toast.success("Message sent", { description: trimmed });

    // optimistic append
    setMessages(prev => [
      ...prev,
      {
        _id: Date.now().toString(),
        text: trimmed,
        from: user.id,
        to: otherUser.id,
        createdAt: new Date().toISOString(),
      },
    ]);

    setMessage("");
  };

  const isMine = (m: Msg) => m.from === user?.id;

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
              <div className="flex w-full justify-end items-center">
                <div className="flex gap-2 items-center">
                  <NotificationsTab />
                  <UserTab user={{ name: user?.name, avatarUrl: user?.avatarUrl }} />
                </div>
              </div>
              <div className='flex items-start w-full'>{otherUser && <ChatName user={otherUser} />}</div>
            </CardHeader>

            <CardContent className="flex flex-col h-[500px] justify-between space-y-4">
              {/* Chat area */}
              <div className="flex-1 overflow-y-auto rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-zinc-400">
                <div className="flex-1 overflow-y-auto rounded-lg p-3 text-sm">
                  {messages.length === 0 ? (
                    <p className="text-center text-zinc-500">No messages yet</p>
                  ) : (
                    <ul className="space-y-2">
                      {messages.map((m) => (
                        <li key={m._id} className={`flex ${isMine(m) ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] rounded-md px-3 py-2 ${isMine(m) ? "bg-violet-600 text-white" : "bg-zinc-800 text-zinc-100"}`}
                            title={new Date(m.createdAt).toLocaleString()}
                          >
                            {m.text}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Input + Send */}
              <form className="space-y-3 flex gap-1 items-start " onSubmit={sendMessage}>
                <Input
                  placeholder="Type your message here..."
                  className="w-full resize-none border-white/10 bg-black/50 text-white placeholder:text-zinc-500"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex items-center justify-between gap-3">
                  <Button
                    type='submit'
                    variant="outline"
                    className="flex items-center gap-2 border-white/20 bg-white/5 text-white hover:bg-zinc-800"
                  >
                    <Send className="h-4 w-4" /> Send
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
