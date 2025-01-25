import { CourseListPage } from "@/features/courses/components/CourseListPage"

import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold md:text-7xl max-w-2xl tracking-tighter">
            Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Learn web accessibility through interactive guides, videos, and
            articles. Allyship gives you the tools to create inclusive,
            user-friendly websites effortlessly. Let&apos;s build the best site
            together!
          </p>
        </div>
      </div>

      <Separator className="my-8" />

      <CourseListPage />
    </div>
  )
}
