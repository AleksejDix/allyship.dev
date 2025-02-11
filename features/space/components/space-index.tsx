import Link from "next/link"
import type { Database } from "@/database.types"

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

type SpaceWithDomains = Database["public"]["Tables"]["Space"]["Row"] & {
  domains: Database["public"]["Tables"]["Domain"]["Row"][]
  owner: Database["public"]["Tables"]["User"]["Row"]
}

export function SpaceIndex({ spaces }: { spaces: SpaceWithDomains[] }) {
  const FREE_TIER_LIMIT = 1

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {spaces.map((space) => (
        <Link
          href={`/spaces/${space.id}`}
          key={space.id}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg hover:no-underline"
        >
          <Card className="h-full transition-colors hover:bg-muted/50">
            <CardHeader>
              <CardTitle>{space.name}</CardTitle>
              <CardDescription>owner: {space.owner.first_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Domains</span>
                        <span>
                          {space.domains.length} / {FREE_TIER_LIMIT}
                        </span>
                      </div>
                      <Progress
                        value={(space.domains.length / FREE_TIER_LIMIT) * 100}
                        className={
                          space.domains.length > FREE_TIER_LIMIT
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
      ))}
    </div>
  )
}
