import Image from "next/image"
import Link from "next/link"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

      <div className="grid gap-10 sm:grid-cols-2">
        {/* Course 1 */}
        <Card className="group relative">
          <CardHeader className="p-0">
            <AspectRatio ratio={16 / 9}>
              {/* <Image
                src="/images/course-1.jpg"
                alt="Applied Accessibility for Beginners"
                className="rounded-t-lg object-cover"
              /> */}
            </AspectRatio>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <CardTitle className="text-2xl font-extrabold">
              Applied Accessibility for Beginners
            </CardTitle>
            <p className="text-muted-foreground">
              This course is designed for beginners who want to learn about web
              accessibility. It covers the basics of accessibility and how to
              implement it on your website.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Level: Beginner</Badge>
              <Badge variant="secondary">Rating: 4.5/5</Badge>
              <Badge variant="secondary">Language: English</Badge>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Badge variant="outline">Author: Aleksej Dix</Badge>
          </CardFooter>
          <Link href="/courses/course-1" className="absolute inset-0">
            <span className="sr-only">View Course</span>
          </Link>
        </Card>

        {/* Course 2 */}
        <Card className="group relative">
          <CardHeader className="p-0">
            <AspectRatio ratio={16 / 9}>
              {/* <Image
                src="/images/course-2.jpg"
                alt="Applied Accessibility Techniques"
                className="rounded-t-lg object-cover"
              /> */}
            </AspectRatio>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <CardTitle className="text-2xl font-extrabold">
              Applied Accessibility Techniques
            </CardTitle>
            <p className="text-muted-foreground">
              Dive deeper into accessibility with this advanced course. Learn
              practical techniques and tools to create web applications that
              meet accessibility standards and provide a seamless experience for
              all users.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Duration: 4 hours</Badge>
              <Badge variant="secondary">Level: Intermediate</Badge>
              <Badge variant="secondary">Price: $79</Badge>
              <Badge variant="secondary">Rating: 4.7/5</Badge>
              <Badge variant="secondary">Language: English</Badge>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Badge variant="outline">Author: Aleksej Dix</Badge>
          </CardFooter>
          <Link href="/courses/course-2" className="absolute inset-0">
            <span className="sr-only">View Course</span>
          </Link>
        </Card>
      </div>
    </div>
  )
}
