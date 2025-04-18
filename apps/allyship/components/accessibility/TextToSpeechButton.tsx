'use client'

import { useState, useCallback } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Volume2 } from 'lucide-react'

/**
 * A button component that uses the browser's native SpeechSynthesis API
 * to read text aloud when clicked.
 */
export function TextToSpeechButton({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()

      if (isSpeaking) {
        setIsSpeaking(false)
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      setIsSpeaking(true)
      window.speechSynthesis.speak(utterance)
    }
  }, [text, isSpeaking])

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={speak}
      aria-pressed={isSpeaking}
      aria-labelledby="speak-button-label"
    >
      <Volume2
        size={16}
        aria-hidden="true"
        className={isSpeaking ? 'text-blue-500' : ''}
      />
      <span id="speak-button-label" className="sr-only">
        {isSpeaking ? 'Stop reading' : 'Read text aloud'}
      </span>
      <span className="ml-2">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
    </Button>
  )
}
