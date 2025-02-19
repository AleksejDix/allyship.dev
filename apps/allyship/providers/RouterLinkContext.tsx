"use client"

import { createContext, ReactNode, useContext } from "react"
import { usePathname } from "next/navigation"

// Create the context for currentPath
const RouterLinkContext = createContext<string | undefined>(undefined)

// Provider component to supply the current path
export const RouterLinkProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() // Get the current path from Next.js

  return (
    <RouterLinkContext.Provider value={pathname}>
      {children}
    </RouterLinkContext.Provider>
  )
}

// Hook to use the RouterLinkContext
export const useRouterLinkContext = () => {
  const context = useContext(RouterLinkContext)
  if (!context) {
    throw new Error(
      "useRouterLinkContext must be used within a RouterLinkProvider"
    )
  }
  return context
}
