import Link from 'next/link'

export default function ExamplesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Examples</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExampleCard
          title="Readability Analysis"
          description="Example of the readability analysis tool that evaluates text complexity."
          href="/examples/readability"
        />
      </div>
    </div>
  )
}

function ExampleCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={href} className="block p-6 h-full">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </Link>
    </div>
  )
}
