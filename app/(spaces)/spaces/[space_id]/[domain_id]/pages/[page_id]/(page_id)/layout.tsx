import { PageNavigation } from "@/features/pages/components/page-navigation"

import { prisma } from "@/lib/prisma"

type LayoutProps = {
  params: { domain_id: string; space_id: string; page_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { domain_id, space_id, page_id } = params

  const page = await prisma.page.findUnique({
    where: {
      id: page_id,
    },
    include: {
      domain: true,
    },
  })

  if (!page) {
    throw new Error("Page not found")
  }

  return (
    <>
      <PageNavigation
        space_id={space_id}
        domain_id={domain_id}
        page_id={page_id}
      />

      {children}
    </>
  )
}
