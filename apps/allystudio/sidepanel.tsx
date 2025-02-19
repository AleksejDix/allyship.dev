import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

import "globals.css"

export default function SidePanel() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="allystudio-theme">
      <div className="flex h-screen w-full flex-col p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Allyship Studio</h1>
          <ThemeToggle />
        </div>
        <div className="mt-4">
          <p>Welcome to Allyship Studio!</p>
        </div>
      </div>
    </ThemeProvider>
  )
}
