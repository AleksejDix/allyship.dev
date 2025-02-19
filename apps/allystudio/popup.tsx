import { LoginForm } from "@/components/login-form"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

import "globals.css"

const IndexPopup = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="allystudio-theme">
      <div className="flex h-[25rem] w-[25rem] flex-col">
        <div className="flex justify-end p-2">
          <ThemeToggle />
        </div>
        <LoginForm />
      </div>
    </ThemeProvider>
  )
}

export default IndexPopup
