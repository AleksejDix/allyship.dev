"use server"

import { revalidatePath } from "next/cache"
import { createServerAction } from "zsa"
import { createClient } from "@/lib/supabase/server"
import { createProgramSchema } from "./schema"

export type Framework = {
  id: string
  display_name: string
  shorthand_name: string
  description: string
  jurisdiction: string
  countries_active: string[]
  status: string
  compliance_type: string
  has_penalties: boolean
  max_penalty: string | null
  official_url: string
  tags: string[]
  control_count?: number
}

export type Program = {
  id: string
  account_id: string
  framework_id: string
  created_at: string
  framework: {
    id: string
    display_name: string
    shorthand_name: string
    jurisdiction: string
    compliance_type: string
  }
}

export type ProgramControl = {
  id: string
  program_id: string
  control_id: string
  created_at: string
  control: {
    id: string
    name: string
    description: string
  }
  checks: Array<{
    id: string
    status: string
    check_type: string
    last_checked_at: string | null
    result_data: any
  }>
}

// Get all available frameworks
export async function getFrameworks() {
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
    // Only show specific frameworks: GDPR, SOC2, and European Accessibility Act
    const allowedFrameworks = ['gdpr', 'soc2', 'european-accessibility-act']

    // Get frameworks
    const { data: frameworks, error: frameworksError } = await supabase
      .from("frameworks")
      .select("*")
      .in("id", allowedFrameworks)
      .order("display_name", { ascending: true })

    if (frameworksError) {
      console.error("Supabase error:", frameworksError)
      return {
        success: false,
        error: {
          message: frameworksError.message || "Failed to fetch frameworks",
          code: frameworksError.code || "fetch_frameworks_failed",
          status: 500,
        },
      }
    }

    // Get control counts for each framework
    const { data: controlCounts, error: controlCountsError } = await supabase
      .from("framework_controls")
      .select("framework_id")
      .in("framework_id", allowedFrameworks)

    if (controlCountsError) {
      console.error("Control counts error:", controlCountsError)
      // Continue without control counts
    }

    // Count controls per framework
    const countMap: Record<string, number> = {}
    controlCounts?.forEach((fc) => {
      countMap[fc.framework_id] = (countMap[fc.framework_id] || 0) + 1
    })

    // Add control_count to each framework
    const frameworksWithCounts = frameworks.map((f) => ({
      ...f,
      control_count: countMap[f.id] || 0,
    }))

    return { success: true, data: frameworksWithCounts as Framework[] }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch frameworks",
        code: "fetch_frameworks_failed",
        status: 500,
      },
    }
  }
}

// Get programs for a specific account
export async function getPrograms(accountId: string) {
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
    // Verify user has access to the account
    const { data: accounts } = await supabase.rpc("get_accounts")
    const hasAccess = accounts?.some((acc: any) => acc.account_id === accountId)

    if (!hasAccess) {
      return {
        success: false,
        error: {
          message: "Access denied to this account",
          code: "access_denied",
          status: 403,
        },
      }
    }

    const { data, error } = await supabase
      .from("programs")
      .select(`
        id,
        account_id,
        framework_id,
        created_at,
        framework:frameworks(
          id,
          display_name,
          shorthand_name,
          jurisdiction,
          compliance_type
        )
      `)
      .eq("account_id", accountId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: {
          message: error.message || "Failed to fetch programs",
          code: error.code || "fetch_programs_failed",
          status: 500,
        },
      }
    }

    return { success: true, data: data as Program[] }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch programs",
        code: "fetch_programs_failed",
        status: 500,
      },
    }
  }
}

// Get a single program by ID with framework details
export async function getProgram(programId: string) {
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
    const { data, error } = await supabase
      .from("programs")
      .select(`
        id,
        account_id,
        framework_id,
        created_at,
        framework:frameworks(
          id,
          display_name,
          shorthand_name,
          description,
          jurisdiction,
          compliance_type
        )
      `)
      .eq("id", programId)
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: {
          message: error.message || "Failed to fetch program",
          code: error.code || "fetch_program_failed",
          status: 500,
        },
      }
    }

    // Verify user has access to the account
    const { data: accounts } = await supabase.rpc("get_accounts")
    const hasAccess = accounts?.some((acc: any) => acc.account_id === data.account_id)

    if (!hasAccess) {
      return {
        success: false,
        error: {
          message: "Access denied to this program",
          code: "access_denied",
          status: 403,
        },
      }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch program",
        code: "fetch_program_failed",
        status: 500,
      },
    }
  }
}

// Get all controls for a program with their check status
export async function getProgramControls(programId: string) {
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
    // First verify the user has access to this program
    const programResult = await getProgram(programId)
    if (!programResult.success) {
      return programResult
    }

    const { data, error } = await supabase
      .from("program_controls")
      .select(`
        id,
        program_id,
        control_id,
        created_at,
        control:controls(
          id,
          name,
          description
        )
      `)
      .eq("program_id", programId)
      .order("control_id", { ascending: true })

    if (error) {
      console.error("Supabase error:", error)
      return {
        success: false,
        error: {
          message: error.message || "Failed to fetch program controls",
          code: error.code || "fetch_program_controls_failed",
          status: 500,
        },
      }
    }

    // Fetch checks for all controls in this program
    const { data: checks, error: checksError } = await supabase
      .from("checks")
      .select("id, control_id, status, check_type, last_checked_at, result_data")
      .eq("program_id", programId)

    if (checksError) {
      console.error("Checks fetch error:", checksError)
      // Continue without checks rather than failing
    }

    // Merge checks into controls
    const controlsWithChecks = data.map((control) => ({
      ...control,
      checks: checks?.filter((check) => check.control_id === control.control_id) || [],
    }))

    return { success: true, data: controlsWithChecks as ProgramControl[] }
  } catch (error) {
    return {
      success: false,
      error: {
        message: "Failed to fetch program controls",
        code: "fetch_program_controls_failed",
        status: 500,
      },
    }
  }
}

// Create a new compliance program
export const createProgram = createServerAction()
  .input(createProgramSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("Unauthorized")
    }

    const { accountId, frameworkId } = input

    // Verify user has access to the account
    const { data: accounts } = await supabase.rpc("get_accounts")
    const hasAccess = accounts?.some((acc: any) => acc.account_id === accountId)

    if (!hasAccess) {
      throw new Error("Access denied to this account")
    }

    // Verify the framework has controls configured
    const { count, error: controlsError } = await supabase
      .from("framework_controls")
      .select("control_id", { count: "exact", head: true })
      .eq("framework_id", frameworkId)

    if (controlsError) {
      console.error("Controls fetch error:", controlsError)
      throw new Error("Failed to fetch framework controls")
    }

    if (!count || count === 0) {
      throw new Error(
        `This framework has no controls configured yet. Please contact support to add controls for this framework.`
      )
    }

    // Create the program (trigger will auto-populate program_controls)
    const { data: program, error: programError } = await supabase
      .from("programs")
      .insert({
        account_id: accountId,
        framework_id: frameworkId,
      })
      .select()
      .single()

    if (programError) {
      console.error("Program creation error:", programError)
      throw new Error(programError.message || "Failed to create program")
    }

    // Note: program_controls are automatically created by the database trigger
    // See migration: 20251214160000_auto_populate_program_controls.sql

    revalidatePath(`/spaces/${accountId}`)
    revalidatePath(`/spaces/${accountId}/programs`)

    return {
      program_id: program.id,
      framework_id: program.framework_id,
      controls_count: count,
    }
  })
