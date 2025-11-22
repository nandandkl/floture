"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, TriangleAlert, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to reset password")
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
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

      {/* Reset Password Card */}
      <Card className="p-8 border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-2xl bg-secondary/30 backdrop-blur-sm">
        {!success ? (
          <>
            <div className="space-y-1.5 mb-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Set new password</h2>
              <p className="text-sm text-muted-foreground">
                Your new password must be different from previously used passwords
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  New password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/70 border-border h-10 text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Confirm new password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleSubmit(e as any)
                      }
                    }}
                    className="bg-background/70 border-border h-10 text-sm placeholder:text-muted-foreground/50 transition-all duration-200 focus:ring-2 focus:ring-primary/60 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
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
                disabled={loading || !token}
              >
                {loading ? "Resetting..." : "Reset password"}
                {!loading && <ArrowRight className="ml-2 w-3.5 h-3.5" />}
              </Button>

              <Link href="/auth/login" className="block text-center">
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
              <h2 className="text-2xl font-semibold text-foreground">Password reset successfully!</h2>
              <p className="text-sm text-muted-foreground px-4">
                Your password has been updated. Redirecting to login...
              </p>
            </div>

            <Link href="/auth/login" className="block">
              <Button
                className="w-full h-10 border-2 text-foreground hover:bg-secondary bg-transparent transition-all duration-300"
              >
                <ArrowLeft className="mr-2 w-3.5 h-3.5" />
                Go to login
              </Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  )
}