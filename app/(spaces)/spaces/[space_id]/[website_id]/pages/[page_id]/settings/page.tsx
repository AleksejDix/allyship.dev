import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  params: {
    page_id: string
    space_id: string
    website_id: string
  }
}

export default async function SettingsPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Delete Page</CardTitle>
            <CardDescription>
              Permanently delete this page and all of its data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <PageDelete page={page} spaceId={space_id} domainId={website_id} /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
