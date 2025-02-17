import Link from "next/link"
import type { Database } from "@/database.types"
import { CreateSpaceDialog } from "@/features/space/components/create-space-dialog"
import { Plus } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { EmptyState } from "@/components/empty"

type SpaceWithDomains = Database["public"]["Tables"]["Space"]["Row"] & {
  domains: { count: number }[]
  owner: Database["public"]["Tables"]["User"]["Row"]
  memberships: Database["public"]["Tables"]["Membership"]["Row"][]
}

export async function SpaceIndex({ spaces }: { spaces: SpaceWithDomains[] }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const FREE_TIER_LIMIT = 1

  if (!spaces.length) {
    return (
      <EmptyState
        icon={Plus}
        title="No spaces found"
        description="Get started by creating your first space. You can create multiple spaces to manage different projects."
      >
        <CreateSpaceDialog />
      </EmptyState>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {spaces.map((space) => {
        const userMembership = space.memberships.find(
          (m) => m.user_id === user?.id
        )
        const role = userMembership?.role || "member"
        const domainCount = space.domains[0]?.count || 0

        return (
          <Link
            href={`/spaces/${space.id}`}
            key={space.id}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg hover:no-underline"
          >
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    <h2>{space.name}</h2>
                  </CardTitle>
                  <Badge variant={role === "owner" ? "default" : "secondary"}>
                    {role}
                  </Badge>
                </div>
                <CardDescription>
                  owner: {space.owner.first_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Domains</span>
                          <span>
                            {domainCount} / {FREE_TIER_LIMIT}
                          </span>
                        </div>
                        <Progress
                          value={(domainCount / FREE_TIER_LIMIT) * 100}
                          className={
                            domainCount > FREE_TIER_LIMIT
                              ? "bg-destructive/20 [&>div]:bg-destructive"
                              : ""
                          }
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Free tier allows {FREE_TIER_LIMIT} domain per space</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
