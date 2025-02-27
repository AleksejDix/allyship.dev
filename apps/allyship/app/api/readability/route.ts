import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { text, systemPrompt } = await req.json()

    const { text: result } = await generateText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze the readability of this text: ${text}`,
        },
      ],
      temperature: 0.2,
      maxTokens: 800,
      format: 'json',
    })

    // Parse the response
    try {
      const parsedResult = JSON.parse(result)
      return NextResponse.json(parsedResult)
    } catch (e) {
      console.error('Error parsing result:', result)
      return NextResponse.json(
        { error: 'Failed to parse analysis result' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error analyzing readability:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
