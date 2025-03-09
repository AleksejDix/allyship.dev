import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

// Simple in-memory cache
const cache = new Map<string, any>()

// Hash function using Web Crypto API (SHA-256)
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

// Generate a cache key using SHA-256 hash
async function getCacheKey(
  text: string,
  systemPrompt: string
): Promise<string> {
  const combined = `${text}_${systemPrompt}`
  return await hashString(combined)
}

// Simple logging helper
function logEvent(event: string, details?: Record<string, any>) {
  console.log(`[Readability API] ${event}`, details || '')
}

export async function POST(req: Request) {
  try {
    const { text, systemPrompt } = await req.json()

    // Check if we have a cached result
    const cacheKey = await getCacheKey(text, systemPrompt)
    if (cache.has(cacheKey)) {
      logEvent('Cache hit', { textLength: text.length })
      return NextResponse.json(cache.get(cacheKey))
    }

    logEvent('Calling OpenAI API', {
      textLength: text.length,
      timestamp: new Date().toISOString(),
    })

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

    logEvent('Received OpenAI response', {
      responseLength: result.length,
      timestamp: new Date().toISOString(),
    })

    // Parse the response
    try {
      const parsedResult = JSON.parse(result)
      // Cache the result before returning
      cache.set(cacheKey, parsedResult)
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
