
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, TriangleAlert } from "lucide-react"
import { signIn } from "next-auth/react"

export default function Component() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Email cannot be empty");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password cannot be empty");
      setLoading(false);
      return;
    }

    try {
      // Call your login API that checks MongoDB
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // If login successful, save user and redirect
      localStorage.setItem("floture_current_user", JSON.stringify(data.user));
      router.push("/app/detect");
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md space-y-8 transition-all duration-500 ease-in-out">
      {/* Brand Section */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Floture Logo"
              className="w-16 h-16 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary/50 tracking-tight">floture</h1>
          <p className="text-xs text-muted-foreground mt-0.5">AI-powered flower identification</p>
        </div>
      </div>

      {/* Login Card */}
      <Card className="p-8 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-2xl bg-secondary/30 backdrop-blur-sm">
        <div className="space-y-1.5 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground mb-1">Email address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLogin(e as any)
                }
              }}
              className="bg-background/70 border-border h-10 text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/60"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-foreground">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline font-medium transition-colors">
                Forgot?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleLogin(e as any)
                }
              }}
              className="bg-background/70 border-border h-10 text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/60"
            />
          </div>

          {error && (
            <div className="flex gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 transition-all duration-300">
              <TriangleAlert className="ml-2 w-3.5 h-3.5 text-red-600" />
              <span className="text-red-600 text-xs font-medium">{error}</span>
            </div>
          )}

          <Button
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-primary/90 cursor-pointer text-primary-foreground h-10 font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
            {!loading && <ArrowRight className="ml-2 w-3.5 h-3.5" />}
          </Button>
        </div>

        <div className="my-5 flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground font-medium">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-border bg-background/70 hover:bg-secondary cursor-pointer font-semibold h-11 rounded-lg transition-all duration-300"
          onClick={() => signIn("google", { callbackUrl: "/app/detect" })}
          disabled={loading}
        >
          <svg className="w-3.5 h-3.5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  )
}