

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
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!name) return setError("Name cannot be empty")
    if (!email) return setError("Email cannot be empty")
    if (!emailRegex.test(email)) return setError("Please enter a valid email address")
    if (password.length < 6) return setError("Password must be at least 6 characters")
    if (password !== confirmPassword) return setError("Passwords do not match")
      

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false)
        setError(data.error || "Something went wrong")
        return
      }



      router.push("/auth/check-email")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <Card className="p-8 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-2xl bg-secondary/30 backdrop-blur-sm">
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-foreground">Get started</h2>
          <p className="text-muted-foreground">Create an account to identify flowers instantly</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2.5">Full name</label>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/70 border-border h-11 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2.5">Email address</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/70 border-border h-11 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2.5">Password</label>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/70 border-border h-11 text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2.5">Confirm password</label>
            <Input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSignup(e as any)
                }
              }}
              className="bg-background/70 border-border h-11 text-base"
            />
          </div>

          {error && (
            <div className="flex gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 transition-all duration-300">
              <TriangleAlert className="ml-2 w-3.5 h-3.5 text-red-600" />
              <span className="text-red-600 text-xs font-medium">{error}</span>
            </div>
          )}

          <Button
            onClick={handleSignup}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-semibold transition-all duration-300 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground font-medium">OR</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full border-border bg-background/70 hover:bg-secondary h-11 font-semibold transition-all duration-300 cursor-pointer"
          onClick={() => signIn("google", { callbackUrl: "/app/detect" })}
          disabled={loading}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}