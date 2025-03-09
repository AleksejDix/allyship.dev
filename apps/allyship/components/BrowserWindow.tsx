import { ReactNode } from 'react'

interface BrowserWindowProps {
  url?: string
  className?: string
  children: ReactNode
}

export const BrowserWindow = ({
  url = 'example.com',
  className = '',
  children,
}: BrowserWindowProps) => {
  return (
    <div
      className={`w-full bg-card rounded-md overflow-hidden border border-border ${className}`}
      aria-hidden="true"
    >
      {/* Browser Chrome */}
      <div className="bg-muted border-b border-border">
        {/* Title bar */}
        <div className="px-4 py-2 flex items-center gap-2">
          {/* Traffic light buttons */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {/* URL Bar */}
          <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2 ml-4">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            {url}
          </div>
        </div>

        {/* Tab bar */}
        <div className="px-4 flex items-center gap-2">
          <div className="bg-background rounded-t-lg px-4 py-1 text-xs border-t border-x border-border flex items-center gap-2">
            <span>{url}</span>
            <div className="w-4 h-4 rounded-full hover:bg-muted flex items-center justify-center">
              ×
            </div>
          </div>
          <div className="w-5 h-5 rounded-md hover:bg-muted flex items-center justify-center text-xs">
            +
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-4 w-full">{children}</div>
    </div>
  )
}
