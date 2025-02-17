import { ThemeSettings } from "@/features/website/components/theme-settings"

import { prisma } from "@/lib/prisma"

type Props = {
  params: { space_id: string; website_id: string }
}

export default async function AdvancedSettingsPage({ params }: Props) {
  const { space_id, website_id } = params

  const domain = await prisma.domain.findUnique({
    where: {
      id: website_id,
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
      <ThemeSettings domain={domain} spaceId={space_id} />
    </div>
  )
}
