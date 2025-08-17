import RegisterForm from "@/components/molecules/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side: Branding / Quote */}
      <div className="hidden lg:flex flex-col justify-between bg-black text-white p-10 rounded-l-2xl">
        <div className="flex items-center gap-2 text-lg font-semibold">
          {/* Logo */}
          <span className="text-2xl">⌘</span>
          <a href='https://sauravgo.fun'>SauravGo.fun</a>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex flex-col justify-center px-8 py-12 relative">
        <div className="flex items-center gap-2 text-lg font-semibold absolute top-4 left-4 lg:hidden">
          <span className="text-2xl">⌘</span>
          <a href='https://sauravgo.fun'>SauravGo.fun</a>
        </div>
        <div className="mx-auto w-full max-w-md space-y-6">

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>

          <RegisterForm />

          <div className="text-xs text-center text-muted-foreground flex gap-1">
            By clicking continue, you agree to our{" "}
            <p className="underline">
              Terms of Service
            </p>{" "}
            and{" "}
            <p className="underline">
              Privacy Policy
            </p>
            .
          </div>

          <div className="text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-md font-medium underline text-muted-foreground"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
