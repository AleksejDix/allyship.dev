import { Domain, Page as PrismaPage, Scan as PrismaScan } from "@prisma/client"

type ScanMetrics = {
  light: {
    violations_count: number
    passes_count: number
  }
  dark: {
    violations_count: number
    passes_count: number
  }
}

type PageScan = PrismaScan & {
  metrics: ScanMetrics | null
  screenshot_light?: string | null
  screenshot_dark?: string | null
}

type DomainPage = PrismaPage & {
  scans: PageScan[]
}

export type DomainWithRelations = Domain & {
  _count: {
    pages: number
  }
  pages: DomainPage[]
}

export type PageWithRelations = PrismaPage & {
  domain: Domain
  scans: (PrismaScan & {
    metrics: ScanMetrics | null
  })[]
}
