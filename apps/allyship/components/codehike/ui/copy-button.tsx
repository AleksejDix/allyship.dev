'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

export function CopyButton({ text }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  return (
    <Button
      variant="secondary"
      size="icon"
      className="h-8 w-8"
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1200)
      }}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </Button>
  )
}
