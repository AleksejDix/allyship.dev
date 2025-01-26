import { CircleCheck, CircleX } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Logo } from "@/components/site/Logo"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"

export default async function PostPage() {
  return (
    <div className="container py-8">
      <PageHeader heading="Brand" description="Brand Assets and Guidelines" />
      <Separator className="my-8" />


      <Card>
        <CardHeader>
          <CardTitle>Allyship Logo</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-square grid place-content-center max-w-44">
            <Logo />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>LinkedIn</CardTitle>
          <CardDescription>Linked in Banner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="width-[1128px] h-[191px] bg-black flex flex-col justify-center items-center">
            <div className="mx-auto inline-flex gap-4 p-4">
              <CircleX className="text-red-400" />
              <CircleX className="text-red-400" />
              <CircleX className="text-red-400" />
              <CircleX className="text-red-400" />
              <CircleCheck className="text-green-400" />
              <CircleCheck className="text-green-400" />
              <CircleCheck className="text-green-400" />
            </div>
            <div>
              <p className="text-muted-foreground max-w-xs">
                AI-Based Web Accessibility
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
