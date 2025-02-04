import Link from "next/link"

import { CoursePreview } from "./CoursePreview"

type CourseListProps = {
  courses: Course[]
}

export const CourseList = ({ courses }: CourseListProps) => {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {courses.map((course) => (
        <li key={course.id}>
          <Link href={`/education/courses/${course.id}`}>
            <CoursePreview course={course} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
