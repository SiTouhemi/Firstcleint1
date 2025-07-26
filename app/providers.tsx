"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { ThemeProvider } from "@/components/theme-provider"

const supabaseUrl = "https://euxevmcceokyuurgbcrn.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eGV2bWNjZW9reXV1cmdiY3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMjkyNzYsImV4cCI6MjA2ODYwNTI3Nn0.DE2YE5TUaK8cCIjV1AwrqnkCrbF0Pj1au4eFP2iyhnY"

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface AppContextType {
  supabase: typeof supabase
  user: any
  loading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within a Providers")
  }
  return context
}
