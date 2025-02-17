import type { Database } from "@/database.types"

type Space = Database["public"]["Tables"]["Space"]["Row"]
type User = Database["public"]["Tables"]["User"]["Row"]
type Domain = Database["public"]["Tables"]["Domain"]["Row"]
type Membership = Database["public"]["Tables"]["Membership"]["Row"]

export type SpaceWithRelations = Space & {
  domains: Domain[]
  owner: User
  memberships: Membership[]
  user_id: string
}

export type SpaceResponse<T = Space> = {
  data?: T
  error?: {
    message: string
    status: number
    code: string
  }
}
