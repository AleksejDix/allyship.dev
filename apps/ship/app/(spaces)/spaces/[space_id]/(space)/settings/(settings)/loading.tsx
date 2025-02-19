import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Space Update Form Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>Name Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-[80%]" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-end border-t border-border py-4">
          <Skeleton className="h-9 w-20" />
        </CardFooter>
      </Card>

      {/* Danger Zone Skeleton */}
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete this workspace and all of its data.
        </p>
        <div className="mt-4">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle>Delete Space</CardTitle>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-[90%] mt-1" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end py-4 border-t border-destructive/50 bg-destructive/5">
              <Skeleton className="h-9 w-20" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
