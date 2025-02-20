import { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'
import { A11yMatrix } from '@/components/blocks/a11y-matrix'
import { PageHeader } from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Accessibility Standards Matrix',
  description:
    'Compare accessibility criteria between different standards and guidelines.',
}

export default function Page() {
  return (
    <div className="container py-8">
      <PageHeader heading="Accessibility Standards Matrix" />

      <Separator className="my-8" />

      <div className="grid gap-8 md:grid-cols-[2fr,1fr] pb-8">
        <div className="dark:prose-invert prose max-w-prose">
          <h2>Why Manual Testing Matters</h2>
          <p>
            While automated accessibility scans are valuable tools, they can
            only detect about 30% of potential accessibility issues. Manual
            testing by professional auditors is crucial because it can uncover
            problems that automated tools miss, such as:
          </p>
          <ul>
            <li>Dynamic content behavior and popup interactions</li>
            <li>Complex navigation patterns and user flows</li>
            <li>ARIA live announcements and screen reader compatibility</li>
            <li>Role alerts and dynamic updates</li>
            <li>Context-dependent accessibility issues</li>
          </ul>
          <h3>How Allyship Helps</h3>
          <p>
            Allyship provides comprehensive manual accessibility audits
            performed by certified professionals. Our experts thoroughly test
            your applications using assistive technologies and real-world
            scenarios, ensuring nothing is overlooked in your accessibility
            compliance journey.
          </p>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3>Start Your A11y Journey</h3>
              </CardTitle>
              <CardDescription>
                Begin with automated testing and enhance your accessibility
                compliance with expert manual audits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/products/automated-accessibility-scanning">
                  Try Automated Testing
                </Link>
              </Button>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/contact">Schedule Manual Audit</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <A11yMatrix />
    </div>
  )
}
