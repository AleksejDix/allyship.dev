import { AccessibilityTests } from "@/components/blocks/Tests"

export default async function PostPage() {
  return (
    <div className="container max-w-3xl space-y-8">
      <header className=" space-y-4">
        <h1 className="text-4xl font-bold md:text-7xl max-w-2xl tracking-tighter text-pretty">
          Automated Accessibility Tests
        </h1>
        <p className="text-xl text-muted-foreground">
          Automated tests to catch accessibility issues early in development
        </p>
      </header>
      <hr className="my-8" />

      <AccessibilityTests />
    </div>
  )
}
