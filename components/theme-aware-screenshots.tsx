"use client"

import Image from "next/image"
import { useTheme } from "next-themes"

interface ThemeAwareScreenshotsProps {
  lightScreenshot: string
  darkScreenshot: string
  alt: string
}

export function ThemeAwareScreenshots({
  lightScreenshot,
  darkScreenshot,
  alt,
}: ThemeAwareScreenshotsProps) {
  const { resolvedTheme } = useTheme()
  const screenshot = resolvedTheme === "dark" ? darkScreenshot : lightScreenshot

  return (
    <div className="relative aspect-video">
      <Image
        src={screenshot}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
