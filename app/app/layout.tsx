"use client"
import type React from "react"
import SessionWrap from "@/app/component/sessionwrap"
import AppLayout from "./AppLayout"

export default function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return <SessionWrap><AppLayout>{children}</AppLayout></SessionWrap>
}