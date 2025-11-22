import type React from "react"
import SessionWrap from "@/app/component/sessionwrap"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionWrap><div className="min-h-screen bg-background flex items-center justify-center p-4">{children}</div></SessionWrap>
}
