import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Define expected request body structure
interface RequestBody {
  imageUrl: string
  altText: string
}

/**
 * Analyzes if an image's alt text properly represents the image content
 * according to WCAG guidelines.
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const { imageUrl, altText } = (await req.json()) as RequestBody

    if (!imageUrl || !altText) {
      return NextResponse.json(
        { error: 'Both imageUrl and altText are required' },
        { status: 400 }
      )
    }

    // Generate analysis using AI
    const { text: analysis } = await generateText({
      model: openai('gpt-4-vision-preview'),
      system: `You are an accessibility expert specializing in image descriptions for WCAG compliance.
Your task is to analyze if the provided alt text accurately describes the image content
according to WCAG 2.1 Success Criterion 1.1.1: Non-text Content.

Guidelines for image alt text:
1. Alt text should be concise but descriptive
2. Alt text should convey the purpose and content of the image
3. Alt text should not include "image of" or "picture of"
4. Decorative images should have empty alt text (alt="")
5. Complex images like charts should have detailed descriptions
6. Functional images (like buttons) should describe their function

Provide a structured analysis with the following:
- Does the alt text match the image content? (yes/no/partially)
- Is the alt text appropriate for WCAG compliance? (yes/no/partially)
- What's good about the alt text?
- How could the alt text be improved?
- A suggested improved alt text
      `,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and determine if the alt text accurately describes it according to WCAG guidelines.

Image URL: ${imageUrl}
Current alt text: "${altText}"

Provide your analysis in JSON format with the following structure:
{
  "matches": "yes|no|partially",
  "isCompliant": "yes|no|partially",
  "strengths": ["list of things done well"],
  "weaknesses": ["list of improvement areas"],
  "suggestedAltText": "your suggested alt text",
  "explanation": "brief explanation of your analysis"
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
      temperature: 0.1,
      format: 'json',
    })

    // Parse the AI response
    let result
    try {
      result = JSON.parse(analysis)
    } catch (e) {
      console.error('Error parsing AI response:', e)
      return NextResponse.json(
        {
          error: 'Failed to parse analysis result',
          rawResponse: analysis,
        },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing image alt text:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
