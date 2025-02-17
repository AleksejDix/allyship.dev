import { WebsiteCreateDialog } from "@/features/websites/components/website-create-dialog"

type Props = {
  params: {
    space_id: string
  }
}

export default async function NotFound({ params }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        No Websites Found
      </h2>
      <p className="mt-2 text-muted-foreground">
        You don't have any websites yet. Create your first one to get started.
      </p>
    </div>
  )
}
