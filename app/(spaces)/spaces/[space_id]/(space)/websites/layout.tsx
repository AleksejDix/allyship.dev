import { PropsWithChildren } from "react"
import { PageHeader } from "@/features/websites/components/page-header"
import { WebsiteCreateDialog } from "@/features/websites/components/website-create-dialog"

type Props = {
  children: React.ReactNode
  params: {
    space_id: string
  }
}
export default async function WebsitesLayout({ params, children }: Props) {
  const { space_id } = await params

  return (
    <>
      <PageHeader title="Websites" description="Manage your websites">
        <WebsiteCreateDialog space_id={space_id} />
      </PageHeader>
      {children}
    </>
  )
}
