import { Block, CodeBlock, parseProps } from "codehike/blocks"
import { highlight, Pre, RawCode } from "codehike/code"

import { callout } from "@/components/codehike/annotations/callout"
import { className } from "@/components/codehike/annotations/classname"
import { diff } from "@/components/codehike/annotations/diff"
import { focus } from "@/components/codehike/annotations/focus"
import { lineNumbers } from "@/components/codehike/annotations/line-numbers"
import { mark } from "@/components/codehike/annotations/mark"
import { tokenTransitions } from "@/components/codehike/annotations/token-transitions"
import { CopyButton } from "@/components/codehike/ui/copy-button"
import { CodeIcon } from "@/components/codehike/ui/icons"

const Schema = Block.extend({
  codeBlock: CodeBlock,
})

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")

  const handlers = [
    mark,
    callout,
    className,
    focus,
    tokenTransitions,
    lineNumbers,
    diff,
  ]

  return (
    <div className="relative my-4">
      <div className="rounded-lg border border-border overflow-hidden">
        {/* Title bar */}
        <div className="relative bg-muted border-b border-border px-4 py-2 flex items-center gap-2">
          {/* Traffic light buttons */}
          <div className="flex gap-1.5 absolute left-0 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          <div className="grow text-tab-activeForeground text-sm flex items-center justify-center gap-3">
            <CodeIcon title={highlighted.meta} />
            <span>{highlighted.meta}</span>
          </div>

          <div className="w-16" />
        </div>

        {/* Code content */}
        <div className="overflow-auto py-4 relative">
          <Pre code={highlighted} handlers={handlers} />
          <div className="absolute top-3 right-3">
            <CopyButton text={highlighted.code} />
          </div>
        </div>
      </div>
    </div>
  )
}
