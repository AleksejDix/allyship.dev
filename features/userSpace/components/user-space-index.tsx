import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { UserSpaceView } from "../types"

interface UserSpaceIndexProps {
  spaces: UserSpaceView[] | null
  error?: {
    message: string
    status: number
    code: string
  }
}

export function UserSpaceIndex({ spaces, error }: UserSpaceIndexProps) {
  if (error) {
    return (
      <div role="alert" className="p-4">
        <h2 className="text-lg font-semibold text-destructive">Error</h2>
        <p className="mt-1 text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  if (!spaces?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          No workspaces yet
        </h2>
        <p className="mt-2 text-muted-foreground">
          Create your first workspace to get started
        </p>
        <Button asChild className="mt-4">
          <Link href="/spaces/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space) => (
        <Card key={space.space_id}>
          <CardHeader>
            <CardTitle>{space.space_name}</CardTitle>
            <CardDescription>
              Owner: {space.owner_first_name} {space.owner_last_name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-1 text-sm">
              <dt className="text-muted-foreground">Domains:</dt>
              <dd className="text-right font-medium">{space.domain_count}</dd>
              <dt className="text-muted-foreground">Role:</dt>
              <dd className="text-right font-medium capitalize">
                {space.user_role}
              </dd>
              <dt className="text-muted-foreground">Status:</dt>
              <dd className="text-right font-medium capitalize">
                {space.membership_status}
              </dd>
            </dl>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/spaces/${space.space_id}`}>View Workspace</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Card className="flex flex-col items-center justify-center p-6">
        <Button asChild variant="ghost">
          <Link href="/spaces/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Workspace
          </Link>
        </Button>
      </Card>
    </div>
  )
}
