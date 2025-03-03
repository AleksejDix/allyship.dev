import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Globe } from "lucide-react"

import { WebsiteAdd } from "./website-add"

export function WebsiteSelectRequired() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-muted">
              <Globe
                size={24}
                className="text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </div>
          <h2 className="text-lg font-semibold">Website Required</h2>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-2">
            Please select a website to view and manage its pages.
          </p>
          <p>
            You can select an existing website or add a new one to continue.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-3">
          <WebsiteAdd />
        </CardFooter>
      </Card>
    </div>
  )
}
