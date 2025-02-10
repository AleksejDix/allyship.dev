import { NextResponse } from "next/server"
import { createPageFromUrl } from "@/features/pages/actions"

export async function POST(
  request: Request,
  { params }: { params: { space_id: string; domain_id: string } }
) {
  try {
    const body = await request.json()
    const result = await createPageFromUrl(
      params.space_id,
      params.domain_id,
      body
    )

    if (!result.success) {
      return NextResponse.json(result, { status: result.error.status })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "An error occurred while processing your request",
          status: 500,
          code: "internal_server_error",
        },
      },
      { status: 500 }
    )
  }
}
