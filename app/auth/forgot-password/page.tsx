"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Ghost, CheckCircle2, TriangleAlert } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!email) {
      setError("Email cannot be empty")
      setLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to send reset email")
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

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

      {/* Forgot Password Card */}
      <Card className="p-8 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-2xl bg-secondary/30 backdrop-blur-sm">
        {!success ? (
          <>
            <div className="space-y-1.5 mb-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Ghost className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Forgot password?</h2>
              <p className="text-sm text-muted-foreground">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSubmit(e as any)
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
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90 cursor-pointer text-primary-foreground h-10 font-semibold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
                {!loading && <ArrowRight className="ml-2 w-3.5 h-3.5" />}
              </Button>

              <Link href="/auth/login" className="block">
                <Button
                  variant="ghost"
                  className="w-full h-10 border-2 text-foreground hover:bg-secondary bg-transparent transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 w-3.5 h-3.5" />
                  Back to login
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1.5 mb-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Check your email</h2>
              <p className="text-sm text-muted-foreground px-4">
                We sent a password reset link to
              </p>
              <p className="text-sm font-semibold text-foreground">{email}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-900 leading-relaxed">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => {
                      setSuccess(false)
                      setEmail("")
                    }}
                    className="font-semibold underline hover:no-underline"
                  >
                    Try another email address
                  </button>
                </p>
              </div>

              <Link href="/auth/login" className="block">
                <Button
                  variant="outline"
                  className="w-full h-10 border-2 text-foreground hover:bg-secondary bg-transparent transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 w-3.5 h-3.5" />
                  Back to login
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}