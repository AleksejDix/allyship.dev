import { CourseListPage } from "@/features/courses/components/CourseListPage"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="container py-8 space-y-8">
      <PageHeader
        heading="Courses"
        description="Learn web accessibility through interactive guides, videos, and articles. Allyship gives you the tools to create inclusive, user-friendly websites effortlessly. Let's build the best site together!"
      />

      <Separator className="my-8" />

      <CourseListPage />
    </div>
  )
}
