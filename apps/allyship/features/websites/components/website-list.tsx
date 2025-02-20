import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'

import { useWebsites } from './websites-provider'

export function WebsiteList() {
  const { websites } = useWebsites()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {websites.map(website => (
        <Card key={website.id}>
          <CardHeader>
            <CardTitle>{website.url}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Theme: {website.theme}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
