// app/page.tsx (Server Component — SSR)
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageSquare,
  ShieldCheck,
  Users,
  Zap,
  Rocket,
  Lock,
} from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "SauravGo • Realtime Chat",
  description:
    "A minimal Socket.IO chat built with Next.js and shadcn/ui.",
};

async function getServerStatus() {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5004";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${socketUrl}/health`, {
      cache: "no-store",
      next: { revalidate: 0 },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok ? (await res.text().catch(() => "ok")) || "ok" : "offline";
  } catch {
    return "offline";
  }
}

export default async function Page() {
  const serverStatus = await getServerStatus();
  const isOnline = serverStatus !== "offline";

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black to-zinc-900 text-white">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="text-2xl">⌘</span>
          <span className="text-lg font-semibold tracking-tight">SauravGo Chat</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-zinc-400 hover:text-white">
            Features
          </Link>
          <Link href="#how" className="text-sm text-zinc-400 hover:text-white">
            How it works
          </Link>
          <Link href="#faq" className="text-sm text-zinc-400 hover:text-white">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Badge
            variant={"secondary" as any}
            className={`hidden md:inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${isOnline ? "bg-zinc-700 text-zinc-300" : "bg-red-500/15 text-red-300"
              }`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${isOnline ? "bg-zinc-300" : "bg-red-400"
                }`}
            />
            {isOnline ? "Server online" : "Server offline"}
          </Badge>
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-200 hover:text-white">
              Login
            </Button>
          </Link>
          <Link href="/chat">
            <Button className="bg-zinc-800 hover:bg-zinc-700 text-white">Open Chat</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300 ring-1 ring-white/10 backdrop-blur">
            <Zap className="h-3.5 w-3.5" /> Realtime • Socket.IO • shadcn/ui
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight md:text-5xl">
            Minimal <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">chat</span> experience
          </h1>
          <p className="max-w-prose text-base text-zinc-300 md:text-lg">
            A clean, monochrome chat built with Next.js, Socket.IO, and shadcn/ui. Fully SSR, blazing fast, and private DM ready.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/chat">
              <Button size="lg" className="bg-zinc-800 hover:bg-zinc-700 text-white">
                Start chatting
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white">
                Continue as guest
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 pt-2 text-sm text-zinc-400">
            <div className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" /> Scales easily
            </div>
            <div className="inline-flex items-center gap-2">
              <Lock className="h-4 w-4" /> Private messaging
            </div>
          </div>
        </div>

        {/* Preview card */}
        <Card className="relative overflow-hidden border-white/10 bg-zinc-900 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-zinc-100">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-black/40 p-4">
              <div className="text-sm text-zinc-300">Socket ID: <span className="text-white">abcd1234</span></div>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value="Type your message here..."
                  className="w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-zinc-300 outline-none placeholder:text-zinc-500"
                />
                <Button variant="outline" className="border-white/20 bg-white/5 text-white">
                  Send
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ShieldCheck className="h-4 w-4" /> Private DM • Typing • Delivery receipts
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between text-xs text-zinc-400">
            <div className="inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Inspired by chat UI
            </div>
            <div className="inline-flex items-center gap-2">
              <Rocket className="h-4 w-4" /> Deploy on Vercel + Node
            </div>
          </CardFooter>
        </Card>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Realtime speed",
              desc: "Socket.IO channels for DMs, rooms, and presence.",
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: "Secure by default",
              desc: "JWT-ready auth & server-side validation.",
            },
            {
              icon: <Users className="h-5 w-5" />,
              title: "Scalable",
              desc: "Easily scale horizontally with Redis adapter.",
            },
          ].map((f, i) => (
            <Card key={i} className="border-white/10 bg-zinc-900">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="rounded-md bg-zinc-700 p-2 text-white">
                  {f.icon}
                </div>
                <CardTitle className="text-white">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">{f.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { step: "1", title: "Connect", desc: "Client connects and gets a socket id." },
            { step: "2", title: "Select user", desc: "Choose a recipient from online users." },
            { step: "3", title: "DM instantly", desc: "Emit `private_message` and receive replies." },
          ].map((s, i) => (
            <Card key={i} className="border-white/10 bg-zinc-900">
              <CardHeader>
                <Badge className="w-fit bg-white/10 px-2 py-1 text-zinc-200">Step {s.step}</Badge>
                <CardTitle className="text-white">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-zinc-300">{s.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto w-full max-w-3xl px-6 pb-24">
        <h2 className="mb-6 text-center text-2xl font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="space-y-3">
          <AccordionItem value="item-1" className="rounded-lg border border-white/10 bg-zinc-900 px-4">
            <AccordionTrigger>Is this page server-rendered?</AccordionTrigger>
            <AccordionContent>
              Yes. This landing page is SSR. The chat itself is a client component using Socket.IO.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="rounded-lg border border-white/10 bg-zinc-900 px-4">
            <AccordionTrigger>How do I change the server URL?</AccordionTrigger>
            <AccordionContent>
              Set <code className="rounded bg-black/40 px-1">NEXT_PUBLIC_SOCKET_URL</code> in your env. Default: <code className="rounded bg-black/40 px-1">http://localhost:5004</code>.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="rounded-lg border border-white/10 bg-zinc-900 px-4">
            <AccordionTrigger>Does it match my chat UI?</AccordionTrigger>
            <AccordionContent>
              Yes — grayscale theme with soft glass panels mirrors your chat page styling.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} SauravGo. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-zinc-300 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-zinc-300 hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
