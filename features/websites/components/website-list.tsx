import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useWebsites } from "./websites-provider"

export function WebsiteList() {
  const { websites } = useWebsites()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {websites.map((website) => (
        <Card key={website.id}>
          <CardHeader>
            <CardTitle>{website.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Theme: {website.theme}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
