import LoginForm from "@/components/molecules/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center px-8 py-12 relative">
        <div className="flex items-center gap-2 text-lg font-semibold absolute top-4 left-4 lg:hidden">
          <span className="text-2xl">⌘</span>
          <a href="https://sauravgo.fun">SauravGo.fun</a>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />

          <div className="text-center">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-md font-medium underline text-muted-foreground"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Branding / Quote */}
      <div className="hidden lg:flex flex-col justify- items-end bg-black text-white p-10 rounded-r-2xl">
        <div className="flex items-center gap-2 text-lg font-semibold">
          {/* Logo */}
          <span className="text-2xl">⌘</span>
          <a href="https://sauravgo.fun">SauravGo.fun</a>
        </div>
      </div>
    </div>
  );
}
