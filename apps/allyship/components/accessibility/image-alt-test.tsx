'use client'

import { useState } from 'react'

interface ImageIssue {
  selector: string
  html: string
  issue: string
  suggestion?: string
}

interface ImageAltResult {
  passed: boolean
  total: number
  missing: number
  empty: number
  decorative: number
  withAlt: number
  issues: ImageIssue[]
  aiExplanation?: string
}

export function ImageAltTest() {
  const [url, setUrl] = useState('')
  const [html, setHtml] = useState('')
  const [result, setResult] = useState<ImageAltResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch HTML from URL
  const fetchHtml = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`)
      }
      const html = await response.text()
      setHtml(html)
      return html
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch URL')
      return null
    }
  }

  // Function to analyze HTML
  const analyzeHtml = async (htmlContent: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/accessibility/image-alt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html: htmlContent }),
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

  // Handle URL submission
  const handleUrlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    const htmlContent = await fetchHtml(url)
    if (htmlContent) {
      await analyzeHtml(htmlContent)
    }
    setLoading(false)
  }

  // Handle direct HTML submission
  const handleHtmlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!html) return

    await analyzeHtml(html)
  }

  return (
    <div className="space-y-8">
      {/* URL Input Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Test Image Alt Text by URL</h2>
          <p className="text-gray-600">
            Enter a URL to analyze the images on that page
          </p>
        </div>
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-3 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* HTML Input Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Test Image Alt Text by HTML</h2>
          <p className="text-gray-600">
            Paste HTML to analyze the images in the code
          </p>
        </div>
        <form onSubmit={handleHtmlSubmit} className="space-y-4">
          <textarea
            value={html}
            onChange={e => setHtml(e.target.value)}
            placeholder="<html>...</html>"
            className="w-full min-h-[200px] p-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Image Accessibility Results</h2>
            <span
              className={`px-2 py-1 rounded-md text-sm ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {result.passed ? 'Passed' : 'Issues Found'}
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Analyzed {result.total} {result.total === 1 ? 'image' : 'images'}
          </p>

          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-3 rounded-md">
                <div className="text-sm font-medium">Total Images</div>
                <div className="text-2xl">{result.total}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded-md">
                <div className="text-sm font-medium">With Alt Text</div>
                <div className="text-2xl">{result.withAlt}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded-md">
                <div className="text-sm font-medium">Missing Alt</div>
                <div className="text-2xl">{result.missing}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded-md">
                <div className="text-sm font-medium">Decorative</div>
                <div className="text-2xl">{result.decorative}</div>
              </div>
            </div>

            {/* AI Explanation */}
            {result.aiExplanation && (
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">AI Analysis</h3>
                <p className="text-sm">{result.aiExplanation}</p>
              </div>
            )}

            {/* Issues List */}
            {result.issues.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">
                  Issues ({result.issues.length})
                </h3>
                <div className="space-y-3">
                  {result.issues.map((issue, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-3"
                    >
                      <div className="text-red-600 font-medium">
                        {issue.issue}
                      </div>
                      {issue.suggestion && (
                        <div className="text-sm mt-1">
                          Suggestion: {issue.suggestion}
                        </div>
                      )}
                      <div className="mt-2 bg-gray-50 p-2 rounded text-xs font-mono overflow-x-auto">
                        {issue.html}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pass Message */}
            {result.passed && (
              <div className="flex items-center gap-2 text-green-600">
                <span>✓</span>
                <span>All images have proper alternative text!</span>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Based on WCAG 2.1 Success Criterion 1.1.1: Non-text Content
          </div>
        </div>
      )}
    </div>
  )
}
