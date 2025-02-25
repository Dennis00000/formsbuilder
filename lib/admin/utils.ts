import { cache } from "react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export const getServerUser = cache(async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: user } = await supabase.from("users").select("role").eq("id", session.user.id).single()

  return {
    ...session.user,
    role: user?.role,
  }
})

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const rateLimiter = new Map<string, number[]>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  // Get existing timestamps for this key
  const timestamps = rateLimiter.get(key) || []

  // Filter out old timestamps
  const validTimestamps = timestamps.filter((t) => t > windowStart)

  // Check if we're over the limit
  if (validTimestamps.length >= limit) {
    return false
  }

  // Add new timestamp
  validTimestamps.push(now)
  rateLimiter.set(key, validTimestamps)

  // Cleanup old entries periodically
  if (Math.random() < 0.1) {
    // 10% chance to clean up
    for (const [k, times] of rateLimiter.entries()) {
      rateLimiter.set(
        k,
        times.filter((t) => t > windowStart),
      )
      if (rateLimiter.get(k)?.length === 0) {
        rateLimiter.delete(k)
      }
    }
  }

  return true
}

