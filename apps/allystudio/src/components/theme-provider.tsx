import { createContext, useContext, useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Initialize storage outside component to be shared
const storage = new Storage()

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ally-studio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => defaultTheme)

  // Initialize theme from storage
  useEffect(() => {
    storage.get<Theme>(storageKey).then((savedTheme) => {
      if (savedTheme) {
        setTheme(savedTheme)
      }
    })
  }, [storageKey])

  // Listen for theme changes from other contexts
  useEffect(() => {
    storage.watch({
      [storageKey]: ({ newValue }) => {
        if (newValue) {
          setTheme(newValue as Theme)
        }
      }
    })
  }, [storageKey])

  // Update document classes when theme changes
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: async (newTheme: Theme) => {
      // Store in Plasmo storage to sync across contexts and browsers
      await storage.set(storageKey, newTheme)
      setTheme(newTheme)
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
