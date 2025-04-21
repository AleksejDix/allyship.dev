'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Play, Pause, Square, Volume2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'

interface TextToSpeechButtonProps {
  text?: string
  contentSelector?: string
  className?: string
  buttonLabel?: string
  preferredVoice?: string
}

// Known high-quality voice names on different platforms
const HIGH_QUALITY_VOICES = [
  // macOS premium voices
  'Samantha',
  'Daniel',
  'Karen',
  'Moira',
  'Tessa',
  // Windows premium voices
  'Microsoft David',
  'Microsoft Zira',
  // Google / Chrome OS voices
  'Google UK English Female',
  'Google UK English Male',
  // iOS/Safari voices
  'Samantha',
  'Alex',
]

// Quality indicators in voice names
const QUALITY_INDICATORS = [
  'natural',
  'premium',
  'enhanced',
  'neural',
  'wavenet',
  'plus',
  'high',
  'professional',
  'refined',
]

// Extract accessible text from a DOM element
function extractAccessibleText(root: Element | Document | null) {
  if (!root) return ''

  let textContent = ''

  // First try using textContent which captures all text, including hidden elements
  // We'll manually filter hidden elements below
  function extractTextFromNode(node: Node) {
    // Skip hidden elements
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const style = window.getComputedStyle(element)

      // Skip hidden content
      if (
        (element.hasAttribute('aria-hidden') &&
          element.getAttribute('aria-hidden') === 'true') ||
        style.display === 'none' ||
        style.visibility === 'hidden'
      ) {
        return
      }

      // Check if this element has an aria-label
      const ariaLabel = element.getAttribute('aria-label')
      if (ariaLabel) {
        textContent += ariaLabel + ' '
        return // Don't process children if aria-label exists
      }
    }

    // Handle text nodes directly
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim()
      if (text) {
        textContent += text + ' '
      }
      return
    }

    // Process children recursively
    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes[i]
      if (childNode) {
        extractTextFromNode(childNode)
      }
    }
  }

  extractTextFromNode(root)

  // Clean up the text
  // - Remove extra whitespace
  // - Ensure periods have spaces after them
  // - Ensure proper spacing around punctuation
  return textContent
    .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
    .replace(/\.\s*([A-Z])/g, '. $1') // Ensure space after periods before capital letters
    .replace(/\s+\./g, '.') // Remove space before periods
    .replace(/\s+,/g, ',') // Remove space before commas
    .replace(/,(?!\s)/g, ', ') // Add space after commas if missing
    .trim()
}

export function TextToSpeechButton({
  text,
  contentSelector,
  className = '',
  buttonLabel = 'Listen to text',
  preferredVoice,
}: TextToSpeechButtonProps) {
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [supported, setSupported] = useState(true)
  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([])
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const contentRef = useRef<Element | null>(null)

  // Check if speech synthesis is supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupported('speechSynthesis' in window)
    }
  }, [])

  // Extract text from DOM if contentSelector is provided
  useEffect(() => {
    if (typeof window !== 'undefined' && contentSelector) {
      contentRef.current = document.querySelector(contentSelector)

      if (contentRef.current) {
        const textContent = extractAccessibleText(contentRef.current)
        setExtractedText(textContent)
      }
    }
  }, [contentSelector])

  // Advanced algorithm to find the best voice
  const findBestVoice = useCallback(
    (
      voices: SpeechSynthesisVoice[],
      preferredName?: string
    ): SpeechSynthesisVoice | null => {
      if (!voices || voices.length === 0) return null

      // If user has a preferred voice and it exists, use it
      if (preferredName) {
        const preferred = voices.find(voice =>
          voice.name.toLowerCase().includes(preferredName.toLowerCase())
        )
        if (preferred) return preferred
      }

      // Score-based system to rank voices
      const scoredVoices = voices
        .filter(voice => voice.lang.includes('en'))
        .map(voice => {
          let score = 0
          const name = voice.name.toLowerCase()

          // Highest priority: Known high-quality voices
          if (HIGH_QUALITY_VOICES.some(v => voice.name.includes(v))) {
            score += 100
          }

          // Priority based on quality indicators in name
          QUALITY_INDICATORS.forEach(indicator => {
            if (name.includes(indicator)) {
              score += 50
            }
          })

          // Boost score for local voices (typically higher quality)
          if (voice.localService) {
            score += 30
          }

          // Small preference for female voices (often more natural sounding)
          if (
            name.includes('female') ||
            name.includes('woman') ||
            /\b(karen|susan|samantha|lisa|joan|allison|victoria|kate)\b/.test(
              name
            )
          ) {
            score += 10
          }

          // OS-specific preferences
          try {
            const userAgent = navigator.userAgent
            const isApple = /Mac|iPhone|iPad|iPod/.test(userAgent)
            const isWindows = /Windows/.test(userAgent)

            if (
              isApple &&
              (name.includes('samantha') || name.includes('alex'))
            ) {
              score += 40 // Apple's Samantha and Alex are high quality
            }

            if (isWindows && name.includes('microsoft')) {
              score += 30 // Microsoft voices on Windows
            }
          } catch (e) {
            // Ignore if navigator is not available
          }

          // Slight preference for voices with moderate to long names (often more detailed/premium)
          if (voice.name.length > 10) {
            score += 5
          }

          return { voice, score }
        })
        .sort((a, b) => b.score - a.score) // Sort by score descending

      return scoredVoices.length > 0 && scoredVoices[0]
        ? scoredVoices[0].voice
        : null
    },
    []
  )

  // Get and cache available voices when they're loaded
  useEffect(() => {
    if (!supported) return

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setAvailableVoices(voices)

        // Find the best voice and set it as selected
        const bestVoice = findBestVoice(voices, preferredVoice)
        setSelectedVoice(bestVoice)

        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
      }
    }

    // Try to get voices immediately
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      setAvailableVoices(voices)
      const bestVoice = findBestVoice(voices, preferredVoice)
      setSelectedVoice(bestVoice)
    } else {
      // If not available yet, set up event listener
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    }

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
    }
  }, [supported, preferredVoice, findBestVoice])

  const speak = useCallback(() => {
    // If using contentSelector, extract text live to ensure it's current
    let textToSpeak = ''

    if (contentSelector && typeof window !== 'undefined') {
      const element = document.querySelector(contentSelector)
      if (element) {
        textToSpeak = extractAccessibleText(element)
      }
    } else if (extractedText) {
      textToSpeak = extractedText
    } else if (text) {
      textToSpeak = text
    }

    if (!supported || !textToSpeak) return

    // Stop any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(textToSpeak)

    // Use the selected voice if available
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    // Set speech parameters for more natural sound
    utterance.rate = 0.95 // Slightly slower than default
    utterance.pitch = 1.0 // Normal pitch
    utterance.volume = 1.0 // Full volume

    // Handle speech events
    utterance.onstart = () => {
      setSpeaking(true)
      setPaused(false)
    }

    utterance.onpause = () => {
      setPaused(true)
    }

    utterance.onresume = () => {
      setPaused(false)
    }

    utterance.onend = () => {
      setSpeaking(false)
      setPaused(false)
    }

    utterance.onerror = () => {
      setSpeaking(false)
      setPaused(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [supported, text, selectedVoice, contentSelector, extractedText])

  const pauseSpeech = () => {
    if (supported && speaking) {
      window.speechSynthesis.pause()
      setPaused(true)
    }
  }

  const resumeSpeech = () => {
    if (supported && paused) {
      window.speechSynthesis.resume()
      setPaused(false)
    }
  }

  const stopSpeech = () => {
    if (supported) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      setPaused(false)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supported) {
        window.speechSynthesis.cancel()
      }
    }
  }, [supported])

  if (!supported) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!speaking ? (
        <Button
          variant="outline"
          size="sm"
          onClick={speak}
          aria-label={buttonLabel}
          className="flex items-center gap-2"
        >
          <Volume2 aria-hidden="true" className="w-4 h-4" />
          <span className="sr-only">{buttonLabel}</span>
        </Button>
      ) : paused ? (
        <Button
          variant="outline"
          size="sm"
          onClick={resumeSpeech}
          aria-label="Resume speech"
        >
          <Play aria-hidden="true" className="w-4 h-4" />
          <span className="sr-only">Resume speech</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={pauseSpeech}
          aria-label="Pause speech"
        >
          <Pause aria-hidden="true" className="w-4 h-4" />
          <span className="sr-only">Pause speech</span>
        </Button>
      )}

      {speaking && (
        <Button
          variant="outline"
          size="sm"
          onClick={stopSpeech}
          aria-label="Stop speech"
        >
          <Square aria-hidden="true" className="w-4 h-4" />
          <span className="sr-only">Stop speech</span>
        </Button>
      )}
    </div>
  )
}
