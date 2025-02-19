import { expect, test } from "@playwright/test"

test("WCAG 1.1.2: Check audio-only and video-only content has text alternatives", async ({
  page,
}) => {
  // Navigate to the page
  await page.goto("/") // Replace with your URL

  // Check all <audio> elements for a nearby transcript or description
  const audioElements = await page.$$("audio")
  for (const audio of audioElements) {
    const transcriptExists = await audio.evaluate((el) =>
      Boolean(
        el.nextElementSibling && el.nextElementSibling.tagName === "FIGCAPTION"
      )
    )

    expect(transcriptExists).toBeTruthy()
  }

  // Check all <video> elements for captions or descriptions
  const videoElements = await page.$$("video")
  for (const video of videoElements) {
    const captionsTrack = await video.evaluate(
      (el) =>
        Array.from(el.querySelectorAll('track[kind="captions"]')).length > 0
    )

    const descriptionExists = await video.evaluate((el) =>
      Boolean(
        el.nextElementSibling && el.nextElementSibling.tagName === "FIGCAPTION"
      )
    )

    // Pass if either captions or description exists
    expect(captionsTrack || descriptionExists).toBeTruthy()
  }
})
