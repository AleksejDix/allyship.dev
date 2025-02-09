// import { Domain } from "@prisma/client"

import { prisma } from "@/lib/prisma"

type Params = {
  page_id: string
}

export default async function Page({ params }: { params: Params }) {
  const { page_id } = await params

  const page = await prisma.page.findUnique({
    where: {
      id: page_id,
    },
  })

  return <div>Single Page {page?.name}</div>
}
