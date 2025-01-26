import { CoursePreview } from "./CoursePreview"
import Link from "next/link"

type CourseListProps = {
  courses: Course[]
}

export const CourseList = ({ courses }: CourseListProps) => {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {courses.map((course) => (
        <li key={course.id}>
          <Link href={`/courses/${course.id}`}>
            <CoursePreview course={course} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
