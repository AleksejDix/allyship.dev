'use client'

import { Input } from '@workspace/ui/components/input'
import { useState } from 'react'

interface WebsiteSearchProps {
  onSearch: (query: string) => void
}

export function WebsiteSearch({ onSearch }: WebsiteSearchProps) {
  const [query, setQuery] = useState('')

  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="search"
        placeholder="Search websites..."
        value={query}
        onChange={e => handleSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
  )
}
