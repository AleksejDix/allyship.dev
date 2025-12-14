"use client"

import { createContext, useContext } from "react"
import type { AccountWithRole } from "@/lib/hooks/use-accounts"

interface AccountContextValue {
  account: AccountWithRole
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined)

export function useAccount() {
  const context = useContext(AccountContext)
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}

interface AccountProviderProps {
  account: AccountWithRole
  children: React.ReactNode
}

export function AccountProvider({ account, children }: AccountProviderProps) {
  return (
    <AccountContext.Provider value={{ account }}>
      {children}
    </AccountContext.Provider>
  )
}
