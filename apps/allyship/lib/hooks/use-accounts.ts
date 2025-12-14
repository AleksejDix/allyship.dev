"use client"

import useSWR, { SWRConfiguration } from "swr"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database.types"

export type AccountWithRole = {
  account_id: string
  account_role: string
  is_primary_owner: boolean
  name: string
  slug: string | null
  personal_account: boolean
  created_at: string | null
  updated_at: string | null
}

export type GetAccountsResponse = AccountWithRole[]

export const useAccounts = (options?: SWRConfiguration) => {
  const supabaseClient = createClient()

  return useSWR<GetAccountsResponse>(
    "accounts",
    async () => {
      const { data, error } = await supabaseClient.rpc("get_accounts")

      if (error) {
        throw new Error(error.message)
      }

      return data as GetAccountsResponse
    },
    options
  )
}
