type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage?: string
  links?: {
    twitter: string
    github: string
  }
}

type TestLevel = "A" | "AA" | "AAA"
type TestStatus = "pending" | "passed" | "failed"

type Test = {
  criterion: string
  level: TestLevel
  link: string
  status: TestStatus
}


type Workspace = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}
