import type { Database } from "@/database.types"

type DbDomain = Database["public"]["Tables"]["Domain"]["Row"]
type DbPage = Database["public"]["Tables"]["Page"]["Row"]
type DbScan = Database["public"]["Tables"]["Scan"]["Row"]
type DbUser = Database["public"]["Tables"]["User"]["Row"]
type DbSpace = Database["public"]["Tables"]["Space"]["Row"]

export type DomainWithRelations = DbDomain & {
  pages: (DbPage & {
    scans: (DbScan & {
      metrics: {
        light?: {
          violations_count: number
          passes_count: number
          incomplete_count: number
          inapplicable_count: number
        }
        dark?: {
          violations_count: number
          passes_count: number
          incomplete_count: number
          inapplicable_count: number
        }
      } | null
    })[]
  })[]
  space: DbSpace & {
    user: DbUser
  }
}

export type PageWithRelations = DbPage & {
  domain: DbDomain
  scans: (DbScan & {
    metrics: {
      light?: {
        violations_count: number
        passes_count: number
        incomplete_count: number
        inapplicable_count: number
      }
      dark?: {
        violations_count: number
        passes_count: number
        incomplete_count: number
        inapplicable_count: number
      }
    } | null
  })[]
}
