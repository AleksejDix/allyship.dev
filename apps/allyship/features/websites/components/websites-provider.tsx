'use client'

import { createContext, useContext, type PropsWithChildren } from 'react'
import { type Tables } from '@/apps/AllyShip/database.types'

type Website = Tables<'Website'>

interface WebsiteContextValue {
  websites: Website[]
}

const WebsiteContext = createContext<WebsiteContextValue | undefined>(undefined)

export function WebsiteProvider({ children }: PropsWithChildren) {
  // State will be implemented with server components
  return (
    <WebsiteContext.Provider
      value={{
        websites: [],
      }}
    >
      {children}
    </WebsiteContext.Provider>
  )
}

export function useWebsites() {
  const context = useContext(WebsiteContext)
  if (context === undefined) {
    throw new Error('useWebsites must be used within a WebsiteProvider')
  }
  return context
}
