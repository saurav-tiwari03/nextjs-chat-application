"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { sendGetRequest, sendPostRequest } from "@/utils/SendRequest";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userNameStatus, setUserNameStatus] = useState<"available" | "taken" | "checking">();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const username = e.target.value;
    setFormData({ ...formData, username });

    setUserNameStatus("checking");
    const isTaken = await sendGetRequest(`/check-username?username=${username}`);
    setUserNameStatus(isTaken?.available ? "available" : "taken");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendPostRequest("/register", formData);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));  
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
      />
      <Input
        type="email"
        name="email"
        placeholder="name@example.com"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        type="text"
        name="username"
        placeholder="john4433"
        value={formData.username}
        onChange={handleUserNameChange}
      />
      {userNameStatus === "checking" && <p>Checking username...</p>}
      {userNameStatus === "taken" && <p className="text-red-500">Username is taken</p>}
      {userNameStatus === "available" && <p className="text-green-500">Username is available</p>}

      {/* Password field with toggle button */}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="••••••••"
          value={formData.password}
          autoComplete="new-password"
          onChange={handleChange}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" color="white"/>
          ) : (
            <Eye className="w-4 h-4" color="white"/>
          )}
        </button>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : "Sign up with Email"}
      </Button>
    </form>
  );
}
