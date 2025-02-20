import { notFound } from 'next/navigation'
import { GlossarySearch } from '@/features/glossary/components/glossary-search'

import { generateMetadata } from '@/lib/metadata'
import { getAllTerms } from '@/lib/terms'
import { Separator } from '@workspace/ui/components/separator'
import { PageHeader } from '@/components/page-header'

export const metadata = generateMetadata({
  title: 'Accessibility Glossary',
  description:
    'Comprehensive guide to web accessibility terms, concepts, and definitions',
  path: '/glossary',
})

export default async function GlossaryPage() {
  const terms = getAllTerms()

  if (!terms.length) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div>
        <PageHeader
          heading="Glossary"
          description="Learn the language of web accessibility and development."
        />
        <Separator className="my-8" />
        <GlossarySearch terms={terms} />
      </div>
    </div>
  )
}
