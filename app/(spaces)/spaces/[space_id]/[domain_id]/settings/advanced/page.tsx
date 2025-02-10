import { ThemeSettings } from "@/features/domain/components/theme-settings"

import { prisma } from "@/lib/prisma"

type Props = {
  params: { space_id: string; domain_id: string }
}

export default async function AdvancedSettingsPage({ params }: Props) {
  const { space_id, domain_id } = params

  const domain = await prisma.domain.findUnique({
    where: {
      id: domain_id,
    },
    select: {
      id: true,
      name: true,
      theme: true,
    },
  })

  if (!domain) {
    throw new Error("Domain not found")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Advanced Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure advanced settings for your domain
        </p>
      </div>
      <ThemeSettings domain={domain} spaceId={space_id} />
    </div>
  )
}
