'use client'

import { useState } from 'react'

interface AltTextAnalysisResult {
  matches: 'yes' | 'no' | 'partially'
  isCompliant: 'yes' | 'no' | 'partially'
  strengths: string[]
  weaknesses: string[]
  suggestedAltText: string
  explanation: string
}

export function AltTextAnalyzer() {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AltTextAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!imageUrl || !altText) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/accessibility/image-alt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, altText }),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`)
      }

      const result = await response.json()
      setResult(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Alt Text Analyzer</h2>
        <p className="text-gray-600 mb-4">
          Check if your alt text properly describes an image according to WCAG
          guidelines.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium mb-1"
            >
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The URL of the image to analyze
            </p>
          </div>

          <div>
            <label htmlFor="altText" className="block text-sm font-medium mb-1">
              Alt Text
            </label>
            <textarea
              id="altText"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              placeholder="Enter the alt text to evaluate"
              className="w-full px-3 py-2 border rounded-md min-h-[80px]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The alt text you want to check for WCAG compliance
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
          >
            {loading ? 'Analyzing...' : 'Analyze Alt Text'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Analysis Results</h2>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.matches === 'yes'
                  ? 'bg-green-100 text-green-800'
                  : result.matches === 'partially'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}
            >
              {result.matches === 'yes'
                ? 'Good Match'
                : result.matches === 'partially'
                  ? 'Partial Match'
                  : 'Poor Match'}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              WCAG Compliance:
              <span
                className={`ml-2 font-medium ${
                  result.isCompliant === 'yes'
                    ? 'text-green-600'
                    : result.isCompliant === 'partially'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {result.isCompliant === 'yes'
                  ? 'Compliant'
                  : result.isCompliant === 'partially'
                    ? 'Partially Compliant'
                    : 'Not Compliant'}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium text-green-700 mb-2">Strengths</h3>
              {result.strengths.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {result.strengths.map((strength, i) => (
                    <li key={i} className="text-sm">
                      {strength}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No strengths identified
                </p>
              )}
            </div>

            <div>
              <h3 className="font-medium text-red-700 mb-2">
                Areas for Improvement
              </h3>
              {result.weaknesses.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {result.weaknesses.map((weakness, i) => (
                    <li key={i} className="text-sm">
                      {weakness}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No weaknesses identified
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Suggested Alt Text</h3>
            <div className="p-3 bg-gray-50 rounded border text-sm">
              {result.suggestedAltText}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Explanation</h3>
            <p className="text-sm text-gray-700">{result.explanation}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-medium">Original Image</h3>
                <p className="text-xs text-gray-500 mt-1">
                  With your alt text: "{altText}"
                </p>
              </div>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Original
              </a>
            </div>
            <div className="mt-2 border p-1 rounded">
              <img
                src={imageUrl}
                alt={altText}
                className="max-w-full h-auto max-h-64 mx-auto"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmaWxsPSIjODg4ODg4Ij5JbWFnZSBjb3VsZCBub3QgYmUgbG9hZGVkPC90ZXh0Pjwvc3ZnPg=='
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
