type Props = {
  spaceId: string
  websiteId: string
  pageId: string
}

export function ConnectorLink() {
  const spaceId = 1
  const websiteId = 2
  const pageId = 3

  const href = `https://allyship.dev/spaces/${spaceId}/${websiteId}/pages/${pageId}`

  return (
    <a href={href} className="text-sm text-muted-foreground">
      View in dashboard
    </a>
  )
}
