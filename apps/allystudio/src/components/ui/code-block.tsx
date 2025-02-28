import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Copy } from "lucide-react"
import { useState } from "react"

interface CodeBlockProps {
  code: string
  language?: string
  maxHeight?: string
  label?: string
  className?: string
}

export function CodeBlock({
  code,
  language = "html",
  maxHeight = "150px",
  label,
  className
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("rounded-md overflow-hidden", className)}>
      {label && (
        <div className="bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground/80 border-b border-muted/30 flex justify-between items-center">
          {label}
          <button
            onClick={copyToClipboard}
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code">
            <Copy size={12} />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <div className="relative">
        <pre className="p-3 text-xs font-mono bg-muted/20 text-foreground/90 overflow-scroll">
          <div className="min-w-max">
            <code>{code}</code>
          </div>
        </pre>

        {!label && (
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code">
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
