import { PageHeader } from "@/features/websites/components/page-header"
import { WebsiteCreateDialog } from "@/features/websites/components/website-create-dialog"

type Props = {
  children: React.ReactNode
  params: Promise<{
    space_id: string
  }>
}

export default async function WebsitesLayout(props: Props) {
  const params = await props.params
  const { space_id } = params

  return (
    <>
      <PageHeader title="Websites" description="Manage your websites">
        <WebsiteCreateDialog space_id={space_id} />
      </PageHeader>
      {props.children}
    </>
  )
}
