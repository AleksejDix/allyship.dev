"use server"

import { revalidatePath } from "next/cache"
import { createServerAction } from "zsa"
import { redirect } from "next/navigation"
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"
import { accountSchema, teamAccountSchema } from "./schema"
import type { AccountWithRole } from "@/lib/hooks/use-accounts"

// Get all accounts for the current user
export async function getAccounts() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        message: "Unauthorized",
        code: "unauthorized",
        status: 401,
      },
    }
  }

  try {
    const { data, error } = await supabase.rpc("get_accounts")

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: {
          message: error.message || "Failed to fetch accounts",
          code: error.code || "fetch_accounts_failed",
          status: 500,
        },
      }
    }

    return { success: true, data: data as AccountWithRole[] }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch accounts",
        code: "fetch_accounts_failed",
        status: 500,
      },
    }
  }
}

// Get a single account by ID
export async function getAccountById(accountId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc("get_account_by_id", {
      account_id: accountId,
    })

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: {
          message: error.message || "Failed to fetch account",
          code: error.code || "fetch_account_failed",
          status: 500,
        },
      }
    }

    if (!data) {
      return {
        success: false,
        error: {
          message: "Account not found",
          code: "account_not_found",
          status: 404,
        },
      }
    }

    return { success: true, data: data as AccountWithRole }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch account",
        code: "fetch_account_failed",
        status: 500,
      },
    }
  }
}

// Get account by slug (for team accounts)
export async function getAccountBySlug(slug: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.rpc("get_account_by_slug", {
      slug,
    })

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: {
          message: error.message || "Failed to fetch account",
          code: error.code || "fetch_account_failed",
          status: 500,
        },
      }
    }

    if (!data) {
      return {
        success: false,
        error: {
          message: "Account not found",
          code: "account_not_found",
          status: 404,
        },
      }
    }

    return { success: true, data: data as AccountWithRole }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch account",
        code: "fetch_account_failed",
        status: 500,
      },
    }
  }
}

// Create a new team account
// NOTE: This server action is deprecated in favor of direct client-side RPC calls
// Kept for reference but not actively used
export const createTeamAccount = createServerAction()
  .input(teamAccountSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const { name, slug } = input

    const { data, error } = await supabase.rpc("create_account", {
      name,
      slug,
    })

    if (error) {
      throw new Error(error.message || "Failed to create team")
    }

    if (!data) {
      throw new Error("No data returned from create_account")
    }

    revalidatePath("/spaces")

    return {
      account_id: data.account_id,
      name: data.name,
      slug: data.slug,
    }
  })

// Update account name
const updateAccountNameSchema = z.object({
  accountId: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(50),
})

export const updateAccountName = createServerAction()
  .input(updateAccountNameSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { accountId, name } = input

    try {
      const { error } = await supabase.rpc("update_account", {
        account_id: accountId,
        name,
      })

      if (error) {
        console.error("Supabase error:", error)
        return {
          success: false,
          error: {
            message: error.message || "Failed to update account",
            code: error.code || "update_account_failed",
            status: 500,
          },
        }
      }

      revalidatePath("/dashboard")
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to update account",
          code: "update_account_failed",
          status: 500,
        },
      }
    }
  })

// Update team slug
const updateTeamSlugSchema = z.object({
  accountId: z.string().uuid(),
  slug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
})

export const updateTeamSlug = createServerAction()
  .input(updateTeamSlugSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const { accountId, slug } = input

    try {
      const { data, error } = await supabase.rpc("update_account", {
        account_id: accountId,
        slug,
      })

      if (error) {
        console.error("Supabase error:", error)
        return {
          success: false,
          error: {
            message: error.message || "Failed to update team slug",
            code: error.code || "update_slug_failed",
            status: 500,
          },
        }
      }

      revalidatePath("/dashboard")
      redirect(`/dashboard/${slug}/settings`)
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to update team slug",
          code: "update_slug_failed",
          status: 500,
        },
      }
    }
  })
