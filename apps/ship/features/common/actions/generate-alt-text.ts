"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateAltText(imageUrl: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system:
        "You will receive an image. Please create an alt text for the image. Be concise. Use adjectives only when necessary. Do not pass 125 characters. Use simple language.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: new URL(imageUrl),
            },
          ],
        },
      ],
      maxTokens: 160,
    })

    return { success: true, altText: text }
  } catch (error) {
    console.error("Error generating alt text:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate alt text",
    }
  }
}
