"use client"

import Image from "next/image"
import { useTheme } from "next-themes"

type ThemeAwareScreenshotsProps = {
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
    <Image
      src={screenshot || ""}
      alt={alt}
      className="w-full aspect-video object-cover"
      width={1200}
      height={675}
    />
  )
}
