import { CoursePreview } from "./CoursePreview"

type CourseListProps = {
  courses: Course[]
}

export const CourseList = ({ courses }: CourseListProps) => {
  return (
    <ul className="grid gap-4 grid-cols-4">
      {courses.map((course) => (
        <li key={course.id}>
          <CoursePreview course={course} />
        </li>
      ))}
    </ul>
  )
}
