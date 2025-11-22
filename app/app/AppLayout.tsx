
"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { LogOut, Upload, History } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [localUser, setLocalUser] = useState<{ email: string; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for user
    const currentUser = localStorage.getItem("floture_current_user")
    if (currentUser) {
      setLocalUser(JSON.parse(currentUser))
    }
    
    // If neither NextAuth session nor localStorage user exists, redirect to login
    if (status === "unauthenticated" && !currentUser) {
      router.push("/auth/login")
    }
    
    setIsLoading(false)
  }, [status, router])

  // Show loading state
  if (isLoading || status === "loading") {
    return null
  }

  // If no authentication from either source, don't render
  if (!session && !localUser) {
    return null
  }

  // Determine which user data to use (prioritize NextAuth, fallback to localStorage)
  const user = session?.user || localUser

  const isDetectPage = pathname === "/app/detect"
  const isHistoryPage = pathname === "/app/history"

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("floture_current_user")
    
    // Sign out from NextAuth if session exists
    if (session) {
      signOut({ callbackUrl: "/auth/login" })
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Floture Logo"
              width={36}
              height={36}
            />
            <span className="text-xl font-bold text-primary/50 group-hover:text-primary/70 transition duration-300">
              floture
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-border text-foreground hover:bg-secondary bg-transparent font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="border-t border-border bg-background/50">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-center">

            <div className="relative bg-secondary/50 rounded-full overflow-hidden flex w-[300px] h-10">

              {/* Slider */}
              <div
                className={`absolute top-0 left-0 h-full w-1/2 rounded-full bg-primary transition-transform duration-300 ${
                  isHistoryPage ? "translate-x-full" : "translate-x-0"
                }`}
              />

              {/* Detect */}
              <Link href="/app/detect" className="relative z-10 w-1/2">
                <button
                  className={`w-full h-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isDetectPage ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Detect
                </button>
              </Link>

              {/* History */}
              <Link href="/app/history" className="relative z-10 w-1/2">
                <button
                  className={`w-full h-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    isHistoryPage ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
              </Link>

            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}