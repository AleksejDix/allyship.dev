import { highlight, Pre, RawCode } from "codehike/code"

import { callout } from "@/components/codehike/annotations/callout"
import { className } from "@/components/codehike/annotations/classname"
import { diff } from "@/components/codehike/annotations/diff"
import { mark } from "@/components/codehike/annotations/mark"
import { CopyButton } from "@/components/codehike/ui/copy-button"

export async function Code({ codeblock }: { codeblock: RawCode }) {
  const highlighted = await highlight(codeblock, "github-dark")

  const handlers = [mark, callout, className, diff]

  return (
    <div className="relative border rounded-md p-4">
      <div className="text-sm text-muted-foreground">{highlighted.meta}</div>

      <div className=" rounded-md overflow-scroll">
        <Pre code={highlighted} handlers={handlers} />
      </div>
      <CopyButton text={highlighted.code} />
    </div>
  )
}
