'use client'

import Link from 'next/link'
import { Bug, CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { BrowserWindow } from '@/components/BrowserWindow'

export const WebScanner = () => {
  return (
    <div className="container mx-auto py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Right content - macOS Browser Mock */}
        <BrowserWindow url="example.com">
          {/* Page Content */}
          <div className="space-y-3 relative overflow-hidden aspect-video w-full">
            {/* Scanning container */}
            <div>
              <div className="absolute inset-0 animate-scan animate-duration-[5s]">
                {/* Left gradient glow */}
                <div className="absolute top-0 left-0 bottom-0 w-[1px] h-full bg-green-500">
                  <div className="absolute animate-hide-right top-0 left-[1px] bottom-0 w-8 bg-gradient-to-l from-transparent to-green-500/20" />
                  <div className="absolute animate-hide-left opacity-0 top-0 right-[1px] bottom-0 w-8 bg-gradient-to-r from-transparent to-green-500/20" />
                </div>
              </div>
              {/* Scattered icons */}
              <Bug className="absolute text-red-500 w-4 h-4 top-[20%] left-[30%] animate-pulse" />
              <XCircle className="absolute text-destructive w-4 h-4 top-[25%] left-[50%] animate-pulse" />
              <Bug className="absolute text-red-500 w-4 h-4 top-[40%] left-[70%] animate-pulse" />
              <CheckCircle className="absolute text-success w-4 h-4 top-[45%] left-[40%] animate-pulse" />
              <Bug className="absolute text-red-500 w-4 h-4 top-[60%] left-[20%] animate-pulse" />
              <XCircle className="absolute text-destructive w-4 h-4 top-[65%] left-[80%] animate-pulse" />
              <Bug className="absolute text-red-500 w-4 h-4 top-[80%] left-[60%] animate-pulse" />
              <CheckCircle className="absolute text-success w-4 h-4 top-[85%] left-[35%] animate-pulse" />
            </div>
            <div className="h-24 w-4/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30" />
            <div className="h-12 w-3/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30" />
            <div className="h-32 w-2/5 rounded-md bg-muted-foreground/30 dark:bg-muted-foreground/30" />
          </div>
        </BrowserWindow>

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
                  No &ldquo;Skip to Content&rdquo; link?
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
                  Screen reader users can&apos;t identify input fields properly.
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
