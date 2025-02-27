'use client'

import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { checkReadability } from './tools/readability-tool'

export function ReadabilityButton() {
  const [isActive, setIsActive] = useState(false)

  const toggleReadability = () => {
    if (isActive) {
      checkReadability('cleanup')
      setIsActive(false)
    } else {
      const result = checkReadability('apply')
      setIsActive(result.success)
    }
  }

  return (
    <Button
      onClick={toggleReadability}
      variant={isActive ? 'default' : 'ghost'}
      size="icon"
      className="relative w-full h-8"
      aria-pressed={isActive}
      title={isActive ? 'Stop Readability Analysis' : 'Analyze Readability'}
    >
      <BookOpen
        className={`h-4 w-4 ${isActive ? 'text-blue-500' : ''}`}
        aria-hidden="true"
      />
    </Button>
  )
}
