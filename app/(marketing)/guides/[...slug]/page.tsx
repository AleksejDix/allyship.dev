import Link from "next/link"
import { Block, CodeBlock, parseRoot } from "codehike/blocks"
import { highlight, Pre, RawCode } from "codehike/code"
import {
  Selectable,
  Selection,
  SelectionProvider,
} from "codehike/utils/selection"
import { z } from "zod"

import { tokenTransitions } from "@/components/annotaions/token-transitions"

import Content from "./content.md"

const Schema = Block.extend({
  intro: Block,
  steps: z.array(Block.extend({ code: CodeBlock })),
  outro: Block,
})

export default function Page() {
  const { intro, steps, outro } = parseRoot(Content, Schema)
  return (
    <div className="container">
      <Link href="/">Back</Link>
      <h1 className="mt-8">{intro.title}</h1>
      {intro.children}
      <SelectionProvider className="flex gap-4">
        <div className="flex-1 mt-32 mb-[90vh] ml-2 prose prose-invert">
          {steps.map((step, i) => (
            <Selectable
              key={i}
              index={i}
              selectOn={["click", "scroll"]}
              className="border-l-4 border-zinc-700 data-[selected=true]:border-blue-400 px-5 py-2 mb-24 rounded bg-zinc-900"
            >
              <h2 className="mt-4 text-xl">{step.title}</h2>
              <div>{step.children}</div>
            </Selectable>
          ))}
        </div>
        <div className="w-[40vw] max-w-xl bg-zinc-900">
          <div className="top-4 sticky overflow-auto">
            <Selection
              from={steps.map((step) => (
                <Code codeblock={step.code} />
              ))}
            />
          </div>
        </div>
      </SelectionProvider>
      <h2>{outro.title}</h2>
      {outro.children}
    </div>
  )
}

async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")
  return (
    <Pre
      code={highlighted}
      handlers={[tokenTransitions]}
      className="min-h-[40rem] bg-transparent"
    />
  )
}
