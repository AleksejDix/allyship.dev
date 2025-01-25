import { CourseList } from "@/features/courses/components/CourseList"

export const CourseListPage = () => {
  const courses: Course[] = [
    {
      id: "1",
      title: "Web Accessibility - 101",
      description:
        "Learn web accessibility through interactive guides, videos, and articles. Allyship gives you the tools to create inclusive, user-friendly websites effortlessly. Let's build the best site together!",
      imageUrl: "/images/courses/web-accessibility.jpg",
      tags: ["Web Development", "Accessibility"],
      lessons: 6,
      duration: "1h 30m",
      level: "Beginner",
    },
    {
      id: "2",
      title: "Web Accessibility - 201",
      description:
        "Take your web accessibility skills to the next level with Allyship. Learn advanced techniques for building inclusive websites.",
      imageUrl: "/images/courses/design-systems.jpg",
      tags: ["Design", "Web Development"],
      lessons: 8,
      duration: "2h 10m",
      level: "Intermediate",
    },
    {
      id: "3",
      title: "Accessible Vue.js Apps",
      description:
        "Learn how to build accessible Vue.js applications with Allyship. This course covers accessible routing, form inputs, and more.",
      imageUrl: "/images/courses/react-development.jpg",
      tags: ["Web Development", "React"],
      lessons: 10,
      duration: "2h 45m",
      level: "Advanced",
    },
  ]

  return <CourseList courses={courses} />
}
