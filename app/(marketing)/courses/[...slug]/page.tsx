
import { VideoPlayer } from "@/features/courses/components/video-player"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Users, Target, Zap, Award, BarChart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FeatureCardsGrid } from "@/components/feature-cards-grid"


export default async function CoursePage({ params }: { params: { slug: string[] } }) {
  const courseId = params.slug[0]


  const course = {
    id: courseId,
    name: "Web Accessibility 101",
    description: "Master the fundamentals of web accessibility and learn how to create inclusive digital experiences for all users.",
    price: "49.99",
    duration: "4 hours",
    students: "1,234",
    lessons: [
      {
        id: "intro",
        title: "Introduction to Web Accessibility",
        videoId: "intro-123",
        transcription: "Welcome to Web Accessibility 101! In this course..."
      },
      {
        id: "wcag",
        title: "Understanding WCAG Guidelines",
        videoId: "wcag-123",
        transcription: "The Web Content Accessibility Guidelines (WCAG) are..."
      },
      {
        id: "semantic",
        title: "Semantic HTML and Accessibility",
        videoId: "semantic-123",
        transcription: "Semantic HTML is the foundation of accessible web content..."
      }
    ]
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="text-primary">
                Most Popular Course
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Web Accessibility 101
              </h1>
              <p className="text-xl text-muted-foreground">
                Master web accessibility and expand your reach to over 1 billion users worldwide. Learn to create inclusive digital experiences that work for everyone.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="shadow-lg">
                  Enroll Now - $49.99
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Preview Course
                </Button>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>4 hours of content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>1,234+ enrolled</span>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-1 shadow-xl">
              <VideoPlayer
                videoId={course.lessons[0].videoId}
                title="Course Preview"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Take This Course */}
      <section className="">
        <FeatureCardsGrid
          title="Why Take This Course?"
          items={[
            {
              icon: Target,
              title: "Stay Competitive",
              description: "Accessibility skills are in high demand. Stand out in the job market with essential expertise."
            },
            {
              icon: Zap,
              title: "Immediate Impact",
              description: "Apply your learning instantly. Make your websites accessible from day one."
            },
            {
              icon: Award,
              title: "Industry Recognition",
              description: "Earn a certificate that demonstrates your commitment to inclusive design."
            },
            {
              icon: BarChart,
              title: "Reach More Users",
              description: "Tap into a market of over 1 billion people with disabilities worldwide."
            }
          ]}
        />
      </section>

      {/* What You'll Learn */}
      <section className="border-y border-border">
        <div className="container py-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What You'll Learn</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive curriculum designed to take you from beginner to accessibility expert.
              Master both theoretical knowledge and practical implementation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Essential Skills</h3>
              <div className="grid gap-4">
                {[
                  "Understanding WCAG 2.1 guidelines and success criteria",
                  "Creating semantic HTML structure for better accessibility",
                  "Implementing keyboard navigation and focus management",
                  "Making forms and interactive elements accessible",
                  "Handling images, media, and dynamic content",
                  "Writing meaningful alt text and descriptions",
                  "Color contrast and visual accessibility",
                  "Mobile accessibility considerations"
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Practical Applications</h3>
              <div className="grid gap-4">
                {[
                  "Real-world accessibility testing and auditing",
                  "Using screen readers and assistive technologies",
                  "Fixing common accessibility issues",
                  "Creating accessible navigation patterns",
                  "Building accessible forms and validation",
                  "Managing focus in single-page applications",
                  "WAI-ARIA implementation and best practices",
                  "Automated testing and continuous monitoring"
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Features */}
      <section className="container py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="grid gap-4">
              {[
                "4 hours of professionally produced video content",
                "Hands-on exercises with real-world examples",
                "Downloadable accessibility checklists and templates",
                "Interactive code examples and demos",
                "Access to exclusive accessibility testing tools",
                "Certificate of completion",
                "Expert instructor support",
                "Lifetime access to all course materials"
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/10">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold">$49.99</p>
                  <p className="text-muted-foreground">One-time payment, lifetime access</p>
                </div>
                <h3 className="text-2xl font-bold mb-4">Course Guarantee</h3>
                <p className="text-muted-foreground mb-6">
                  If you're not satisfied with the course within 30 days, we'll give you a full refund.
                  No questions asked. Your success and satisfaction are our top priorities.
                </p>
                <Button className="w-full" size="lg">
                  Enroll Now - $49.99
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
