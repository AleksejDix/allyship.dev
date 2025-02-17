import type { Database } from "@/database.types"

export type UserSpaceView = Database["public"]["Views"]["UserSpaceView"]["Row"]

export type UserSpaceViewResponse = {
  spaces: UserSpaceView[] | null
  error?: {
    message: string
    status: number
    code: string
  }
}
