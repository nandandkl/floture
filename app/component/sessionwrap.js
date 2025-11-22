"use client"
import { SessionProvider } from "next-auth/react"

const SessionWrap = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default SessionWrap