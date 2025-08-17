"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLoader from "@/components/PageLoader";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Always wait at least 1 second before deciding
    const timer = setTimeout(() => {
      if (token) {
        router.push("/"); // redirect if logged in
      } else {
        setChecking(false); // no token → show children
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <PageLoader />
      </div>
    );
  }

  return <>{children}</>;
}
