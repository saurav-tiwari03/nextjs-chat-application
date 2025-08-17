# SauravGo Chat — Realtime Chat App (Next.js + shadcn/ui + Socket.IO)

A sleek, **monochrome-themed** chat application with a **server-rendered landing page**, realtime messaging via **Socket.IO**, **shadcn/ui** components, a searchable user list, and a dropdown **Notifications Tab**—all production-ready for Vercel + Node.

---

## ✨ Features

* **SSR Landing Page** (`app/page.tsx`) — fast, SEO-friendly marketing page
* **Realtime Chat** (`/chat`) — private DM flow with Socket.IO
* **Search Users** panel — debounced search with shadcn `Input/Card`
* **Notifications Tab** — bell icon dropdown with unread badge, mark-all-read, clear
* **Monochrome UI** — grayscale design using shadcn/ui + Tailwind
* **Toasts** via `sonner`
* **Environment-driven** Socket server URL

---

## 🧰 Tech Stack

* **Next.js (App Router)**
* **TypeScript**
* **shadcn/ui** (Radix primitives + Tailwind)
* **Socket.IO** (client)
* **lucide-react** icons
* **sonner** for toasts

---

## 📁 Project Structure (key bits)

```
app/
  page.tsx             # SSR landing page (monochrome)
  chat/page.tsx        # Chat UI (client component)
components/
  molecules/
    SearchUser.tsx     # Debounced user search panel
    NotificationsTab.tsx  # Bell dropdown with chat-like notifications
components/ui/         # shadcn components (button, card, input, dropdown-menu, etc.)
utils/
  SendRequest.ts       # fetch wrapper (sendGetRequest)
```

---

## ⚙️ Setup

### 1) Clone & Install

```bash
git clone <your-repo-url>
cd <your-repo>
pnpm install    # or npm i / yarn
```

### 2) Tailwind & shadcn/ui (if not already)

```bash
# Add required shadcn components used in this repo:
npx shadcn@latest add button card input textarea select dropdown-menu alert-dialog badge scroll-area
```

### 3) Other libs

```bash
pnpm add socket.io-client lucide-react sonner
```

### 4) Environment

Create `.env.local` in the project root:

```bash
# Socket server (Node/Express with socket.io). Local default: 5004
NEXT_PUBLIC_SOCKET_URL=http://localhost:5004
```

---

## ▶️ Running the App

### Dev mode

```bash
pnpm dev
# http://localhost:3000
```

### Lint / Build / Start

```bash
pnpm lint
pnpm build
pnpm start
```

---

## 🔌 Minimal Socket.IO Server (example)

If you don’t already have a Socket.IO backend, this gets you going quickly:

```ts
// server/index.ts
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: ["http://localhost:3000"], credentials: true },
});

app.get("/health", (_req, res) => res.status(200).send("ok"));

let onlineUsers = new Set<string>();

io.on("connection", (socket) => {
  onlineUsers.add(socket.id);
  io.emit("allUsers", Array.from(onlineUsers));

  socket.on("private_message", ({ text, to }) => {
    if (to) io.to(to).emit("reply", { text: `From ${socket.id}: ${text}` });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    io.emit("allUsers", Array.from(onlineUsers));
  });
});

const PORT = process.env.PORT || 5004;
httpServer.listen(PORT, () => console.log(`Socket server on :${PORT}`));
```

Run it:

```bash
pnpm add -D ts-node nodemon @types/node
pnpm add express socket.io cors
npx ts-node server/index.ts
# or with nodemon for live reload
```

Make sure your `.env.local` in the Next app points to this server:

```
NEXT_PUBLIC_SOCKET_URL=http://localhost:5004
```

---

## 🖼️ Key Screens

* **Landing Page**: SSR hero, features, how-it-works, FAQ, footer.
* **Chat Page**: centered card with message box, user selector, online users tray.
* **SearchUser**: debounced search inside a card (can be embedded as a side panel).
* **Notifications Tab**: bell icon dropdown with unread count, links to chats.

> Replace link destinations or add real data as needed.

---

## 🧩 Important Components

### `app/page.tsx` (SSR Landing)

* Monochrome gradient background
* Sections: Header, Hero, Features, How it works, FAQ, Footer
* Server-side health check of `NEXT_PUBLIC_SOCKET_URL/health`

### `app/chat/page.tsx` (Client Chat)

* Connects to Socket.IO once mounted
* Emits `private_message` to selected user
* Receives `reply` and updates UI via toasts

### `components/molecules/SearchUser.tsx`

* Debounced `sendGetRequest('/search?search=...')`
* Displays results in a scrollable card
* Calls `onSelectUser(userName)` when an item is clicked

### `components/molecules/NotificationsTab.tsx`

* Dropdown with bell trigger and badge
* Constant demo notifications (chat-style)
* Mark all read / Clear / Deep links to `/chat?user=...`

---

## 🔒 Auth (optional)

The repo is UI-ready. For logout/profile:

* Plug in **Supabase**, **NextAuth**, **Clerk**, or your own API.
* Replace the placeholder `handleLogout()` in `UserTab` if using that pattern.

---

## 🚀 Deployment

* **Frontend**: Vercel (Next.js app).
* **Socket server**: Node/Express app on Railway, Render, Fly.io, or any VM.

  * Allow CORS from your frontend domain.
  * Set `NEXT_PUBLIC_SOCKET_URL` on your Vercel project (e.g., `https://your-socket-host`).

---

## 🧪 Testing Ideas

* Unit test pure helpers (e.g., formatters)
* E2E with Playwright/Cypress (connect mock server or a test socket namespace)
* Storybook for UI components (shadcn cards, dropdowns, inputs)

---

## ❓ FAQ

**Q: Why SSR the landing page?**
A: Faster first paint and SEO; the chat itself is a client component for sockets.

**Q: My badge count doesn’t update.**
A: In `NotificationsTab`, swap the demo state with your realtime socket events or API.

**Q: How do I add message history?**
A: Keep an array in state for `{from, to, text, time}`, render it in a scrollable area, and append on `reply`.

---

## 📄 License

MIT — use freely in personal and commercial projects. Attribution appreciated.

---

## 🙌 Credits

* UI kit by **shadcn/ui**
* Icons by **lucide-react**
* Realtime by **Socket.IO**
* Toasts by **sonner**

---

## ✅ Next Steps (nice-to-haves)

* Persist message history
* Presence/typing indicators
* Attachments (images/files)
* Auth integration (Supabase/NextAuth)
* Redis adapter for Socket.IO (scale to multiple instances)

---

If you share your repo URL, I can tailor the README to your exact file paths and scripts.
