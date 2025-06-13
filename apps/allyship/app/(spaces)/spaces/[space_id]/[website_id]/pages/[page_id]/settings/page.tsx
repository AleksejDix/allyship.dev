import { ScanScheduleWrapper } from '@/features/scans/components/scan-schedule-wrapper'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'

type Props = {
  params: Promise<{
    page_id: string
    space_id: string
    website_id: string
  }>
}

export default async function SettingsPage({ params }: Props) {
  const { page_id } = await params

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <ScanScheduleWrapper pageId={page_id} />

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
