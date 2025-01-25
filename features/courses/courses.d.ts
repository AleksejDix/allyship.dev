type Course = {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  lessons: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
}
