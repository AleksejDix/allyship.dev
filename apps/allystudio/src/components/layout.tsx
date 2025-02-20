import type { PropsWithChildren } from "react"

import { ThemeProvider } from "./theme-provider"

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ally-studio-theme">
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </ThemeProvider>
  )
}
