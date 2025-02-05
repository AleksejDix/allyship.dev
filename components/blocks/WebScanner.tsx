"use client"

import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export const WebScanner = () => {
  return (
    <div className="container max-w-screen-xl mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Right content - macOS Browser Mock */}
        <div
          aria-hidden="true"
          className="w-full h-full bg-card rounded-md border border-border"
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
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                example.com
              </div>
            </div>

            {/* Tab bar */}
            <div className="px-4 flex items-center gap-2">
              <div className="bg-background rounded-t-lg px-4 py-1 text-xs border-t border-x border-border flex items-center gap-2">
                <span>example.com</span>
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
          <div className="p-4 space-y-3 relative overflow-hidden aspect-video w-full">
            {/* Scanning container */}
            <div>
              <div className="absolute inset-0 animate-scan animate-duration-[5s]">
                {/* Left gradient glow */}
                <div className="absolute top-0 left-0 bottom-0 w-[1px] h-full bg-green-500">
                  <div className="absolute animate-hide-right top-0 left-[1px] bottom-0 w-8 bg-gradient-to-l from-transparent to-green-500/20" />
                  <div className="absolute animate-hide-left opacity-0 top-0 right-[1px] bottom-0 w-8 bg-gradient-to-r from-transparent to-green-500/20" />
                </div>
                {/* Glowing line */}
                {/* Right gradient glow */}
              </div>
            </div>
            <div className="h-24 w-4/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
            <div className="h-12 w-3/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
            <div className="h-32 w-2/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30 animate-pulse" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-pretty font-display sm:text-3xl">
            Is Your Website Making These Accessibility Mistakes?
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-red-500/10 rounded-md p-2">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  No "Skip to Content" link?
                </p>
                <p className="text-muted-foreground">
                  Screen reader users might get stuck listening to every menu
                  item.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-red-500/10 rounded-md p-2">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-foreground font-medium">Unlabeled forms?</p>
                <p className="text-muted-foreground">
                  Screen reader users can't identify input fields properly.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-red-500/10 rounded-md p-2">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  Low color contrast?
                </p>
                <p className="text-muted-foreground">
                  Users with low vision struggle to read your content.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-green-500/10 rounded-md p-2">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  Fix these issues and create a website that works for everyone!
                </p>
              </div>
            </div>

            {/* Add CTA Button */}
            <div className="pt-4">
              <Button asChild>
                <Link href="/products/automated-accessibility-scanning">
                  Scan Your Website Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
