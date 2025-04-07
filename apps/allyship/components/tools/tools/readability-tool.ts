import { BaseTool, ToolResult } from './base-tool'

interface ReadabilityResult {
  score: number
  explanation: string
  details: string[]
}

// System prompt for readability analysis
const READABILITY_SYSTEM_PROMPT = `You are an expert in text readability analysis. Your task is to evaluate the readability level of the provided text using the Flesch-Kincaid Grade Level scale.

CRITICALLY IMPORTANT:
1. Analyze the text in the language it is written in
2. DO NOT translate the text to other languages
3. Use readability metrics appropriate for the text's language
4. Return the result STRICTLY in JSON format:
{
  "score": number,
  "explanation": "Brief explanation of the score (up to 100 characters)",
  "details": ["List of complex words, terms, and sentences with specific examples in quotes"]
}

Scoring categories:
- Basic (1-6): Text is easy to read, suitable for a wide audience
- Average (7-12): Text of medium complexity, requires basic education
- Skilled (13+): Complex text, requires higher education

In your analysis, consider:
1. Sentence length
2. Complexity of words used
3. Overall text structure
4. Presence of specialized terminology

IMPORTANT: When listing complex words or sentences in the "details" array, ALWAYS include specific examples in quotes.`

export class ReadabilityTool extends BaseTool {
  protected isActive: boolean = false
  protected addedElements: Set<HTMLElement> = new Set()
  private analysisResults: Map<HTMLElement, ReadabilityResult> = new Map()
  private totalScore: number | null = null
  private minParagraphLength: number = 30
  private analysisQueue: Set<HTMLElement> = new Set()
  private processingElement: HTMLElement | null = null
  private analyzedTexts: Set<string> = new Set()
  private resultsCache: Map<string, ReadabilityResult> = new Map()
  private cacheHits: number = 0

  constructor() {
    super()
    // Check if document exists (for SSR)
    if (typeof document !== 'undefined') {
      this.addStyles()
    }
  }

  private addStyles(): void {
    // Check if document exists (for SSR)
    if (typeof document === 'undefined') return

    const styles = document.createElement('style')
    styles.textContent = `
      .readability-result-container {
        position: relative;
        margin: 1em 0;
        padding-right: 4.5em;
      }
      .readability-indicator {
        position: absolute;
        right: 0;
        top: 0;
        min-width: 3.5em;
        padding: 0.5em;
        border-radius: 0.5em;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 40;
        border: 2px solid rgba(255,255,255,0.2);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .readability-indicator:hover {
        transform: scale(1.05);
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      }
      .readability-tooltip {
        position: absolute;
        right: 100%;
        top: 0;
        width: 300px;
        background: #121212;
        color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        padding: 12px;
        margin-right: 10px;
        z-index: 50;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        font-size: 13px;
        max-height: 400px;
        overflow-y: auto;
      }
      .readability-indicator:hover .readability-tooltip {
        opacity: 1;
        visibility: visible;
      }
      .readability-tooltip ul {
        margin: 0;
        padding-left: 16px;
      }
      .readability-tooltip li {
        margin-bottom: 4px;
        color: #e0e0e0;
      }
      .readability-score {
        font-size: 1.4em;
        font-weight: bold;
        color: #ffffff;
        text-shadow: 1px 1px 0 rgba(0,0,0,0.5);
        position: relative;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      .readability-loading {
        background: #121212;
        border-color: #ffeeba;
        color: #ffeeba;
      }
      .readability-error {
        background: #121212;
        border-color: #f5c6cb;
        color: #f5c6cb;
      }
      .table-wrapper .readability-indicator {
        position: absolute;
        right: -4.5em;
        top: 0;
      }
    `
    document.head.appendChild(styles)
  }

  getSelector(): string {
    return `
      article > p,
      article > section > p,
      .prose > p,
      .content > p,
      [class*="article"] > p,
      [class*="content"] > p,
      [class*="post"] > p,
      main p,
      .container p,
      body > div p
    `.trim()
  }

  getElements(): NodeListOf<HTMLElement> {
    // Check if document exists (for SSR)
    if (typeof document === 'undefined')
      return [] as unknown as NodeListOf<HTMLElement>

    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  private async analyzeText(text: string): Promise<ReadabilityResult> {
    try {
      // Check cache first
      if (this.resultsCache.has(text)) {
        const cachedResult = this.resultsCache.get(text)
        if (cachedResult) {
          this.cacheHits++
          return cachedResult
        }
      }

      // Call the API endpoint
      const response = await fetch('/api/readability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          systemPrompt: READABILITY_SYSTEM_PROMPT,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const result = await response.json()

      // Cache the result
      this.resultsCache.set(text, result)

      return result
    } catch (error) {
      console.error('Error analyzing text:', error)
      return {
        score: 0,
        explanation: 'Analysis failed',
        details: ['Error analyzing text'],
      }
    }
  }

  private async analyzeElement(el: HTMLElement): Promise<void> {
    if (this.processingElement === el || this.analysisQueue.has(el)) {
      return
    }

    const text = el.textContent?.trim() || ''

    if (text.length < this.minParagraphLength) {
      return
    }

    if (this.analyzedTexts.has(text)) {
      return
    }

    this.analyzedTexts.add(text)
    this.analysisQueue.add(el)

    try {
      this.processingElement = el

      const container = document.createElement('div')
      container.className = 'readability-result-container'
      el.parentElement?.insertBefore(container, el)
      container.appendChild(el)

      const loadingIndicator = document.createElement('div')
      loadingIndicator.className = 'readability-indicator readability-loading'
      loadingIndicator.innerHTML = 'Analyzing...'
      container.appendChild(loadingIndicator)

      const result = await this.analyzeText(text)

      this.analysisResults.set(el, result)
      this.showAnalysisResult(container, result)
    } catch (error) {
      console.error('Error during analysis:', error)

      const errorIndicator = el.parentElement?.querySelector(
        '.readability-indicator'
      )
      if (errorIndicator) {
        errorIndicator.innerHTML = 'Error ⚠️'
        errorIndicator.className = 'readability-indicator readability-error'
      }
    } finally {
      this.analysisQueue.delete(el)
      if (this.processingElement === el) {
        this.processingElement = null
      }
    }
  }

  private showAnalysisResult(
    container: HTMLElement,
    result: ReadabilityResult
  ): void {
    container.querySelector('.readability-indicator')?.remove()

    const indicator = document.createElement('div')
    const borderColor = this.getScoreBorderColor(result.score)

    indicator.className = 'readability-indicator'
    indicator.style.background = '#121212'
    indicator.style.borderColor = borderColor

    // Create the main indicator (score only)
    indicator.innerHTML = `
      <div class="readability-score" style="color: ${borderColor};">${result.score.toFixed(1)}</div>
      <div class="readability-tooltip">
        <div style="font-weight: 600; margin-bottom: 8px;">${result.explanation}</div>
        ${
          result.details && result.details.length > 0
            ? `
          <div style="margin-top: 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">Complex Elements:</div>
            <ul style="padding-left: 16px;">
              ${result.details.map(detail => `<li style="margin-bottom: 4px;">${detail}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }
      </div>
    `

    container.appendChild(indicator)

    const element = container.firstElementChild as HTMLElement
    if (element) {
      element.style.backgroundColor = this.getScoreBgColor(result.score)
      element.style.transition = 'background-color 0.3s ease'
    }
  }

  private getScoreBackgroundColor(score: number, alpha: number = 1): string {
    if (score <= 6) return `rgba(220, 252, 231, ${alpha})` // Green
    if (score <= 12) return `rgba(254, 249, 195, ${alpha})` // Yellow
    return `rgba(254, 226, 226, ${alpha})` // Red
  }

  private getScoreBorderColor(score: number): string {
    if (score <= 6) return '#16a34a' // Green
    if (score <= 12) return '#ca8a04' // Yellow
    return '#dc2626' // Red
  }

  private getScoreBgColor(score: number): string {
    if (score <= 6) return '#16a34a20' // Green with transparency
    if (score <= 12) return '#ca8a0420' // Yellow with transparency
    return '#dc262620' // Red with transparency
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    if (!this.isActive) return { isValid: false }

    this.analyzeElement(el)
    this.addedElements.add(el)

    return { isValid: true }
  }

  cleanup(): void {
    // Check if document exists (for SSR)
    if (typeof document === 'undefined') return

    this.isActive = false
    this.analysisQueue.clear()
    this.processingElement = null
    this.analyzedTexts.clear()

    document
      .querySelectorAll('.readability-result-container')
      .forEach(container => {
        const content = container.querySelector(
          'p, h1, h2, h3, h4, h5, h6, li'
        ) as HTMLElement
        if (content) {
          content.style.backgroundColor = ''
          content.style.transition = ''
          container.parentElement?.insertBefore(content, container)
        }
        container.remove()
      })

    this.analysisResults.clear()
    this.totalScore = null
    this.addedElements.clear()
  }

  run(action: 'apply' | 'cleanup'): ToolResult {
    // Check that document exists (for SSR)
    if (typeof document === 'undefined') return { success: false }

    if (action === 'cleanup') {
      this.cleanup()
      return { success: true }
    }

    if (this.isActive) {
      return { success: false }
    }

    this.isActive = true

    const elements = this.getElements()

    // If there are no elements to analyze
    if (elements.length === 0) {
      this.isActive = false

      // Create a notification to inform the user
      const notification = document.createElement('div')
      notification.className = 'readability-notification'
      notification.style.position = 'fixed'
      notification.style.top = '20px'
      notification.style.right = '20px'
      notification.style.backgroundColor = '#f8d7da'
      notification.style.color = '#721c24'
      notification.style.padding = '15px 20px'
      notification.style.borderRadius = '5px'
      notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'
      notification.style.zIndex = '9999'
      notification.style.maxWidth = '300px'
      notification.innerHTML =
        'No text content found to analyze. Try on a page with more text content.'

      document.body.appendChild(notification)

      // Remove the notification after 5 seconds
      setTimeout(() => {
        notification.style.opacity = '0'
        notification.style.transition = 'opacity 0.5s ease'
        setTimeout(() => notification.remove(), 500)
      }, 5000)

      return { success: false }
    }

    // Process each element
    elements.forEach(el => {
      this.validateElement(el)
    })

    return { success: true }
  }
}

const readabilityTool = new ReadabilityTool()

export function checkReadability(action: 'apply' | 'cleanup'): ToolResult {
  if (action === 'cleanup') {
    readabilityTool.cleanup()
    return { success: true }
  }

  const result = readabilityTool.run(action)
  return result
}
