import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import type { PropsWithChildren } from "react"

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ally-studio-theme">
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}
