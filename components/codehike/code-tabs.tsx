import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { highlight, Pre, RawCode } from "codehike/code"
import { z } from "zod"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Content from "./content.mdx"

export default async function Page() {
  return <Content components={{ CodeWithTabs }} />
}

const Schema = Block.extend({ tabs: z.array(CodeBlock) })

async function CodeWithTabs(props: unknown) {
  const { tabs } = parseProps(props, Schema)
  return <CodeTabs tabs={tabs} />
}

export async function CodeTabs(props: { tabs: RawCode[] }) {
  const { tabs } = props
  const highlighted = await Promise.all(
    tabs.map((tab) => highlight(tab, "github-from-css"))
  )
  return (
    <Tabs defaultValue={tabs[0]?.meta} className="dark rounded">
      <TabsList className="rounded-none">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.meta} value={tab.meta}>
            {tab.meta}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab, i) => (
        <TabsContent key={tab.meta} value={tab.meta} className="mt-0">
          <Pre code={highlighted[i]} className="m-0 rounded-none bg-zinc-950" />
        </TabsContent>
      ))}
    </Tabs>
  )
}
