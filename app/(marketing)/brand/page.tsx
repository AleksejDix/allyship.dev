import { CircleCheck, CircleX } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader } from "@/components/loader"
import { PageHeader } from "@/components/page-header"

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
          <div className="aspect-square grid place-content-center max-w-44 border overflow-hidden">
            <Loader size={64} />
          </div>
          <svg
            viewBox="0 0 48 48"
            className="w-[128px] h-[128px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <foreignObject x="0" y="0" width="48" height="48">
              <div className="aspect-square grid place-content-center w-[48px] h-[48px] overflow-hidden">
                <Loader size={24} />
              </div>
            </foreignObject>
          </svg>
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
