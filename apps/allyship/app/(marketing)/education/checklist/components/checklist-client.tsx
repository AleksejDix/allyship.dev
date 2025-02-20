'use client'

import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormItem } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'

import type { ChecklistSection } from '../types'

interface ChecklistClientProps {
  items: ChecklistSection[]
  totalItems: number
}

export function ChecklistClient({ items, totalItems }: ChecklistClientProps) {
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [allChecked, setAllChecked] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const form = useForm()

  const progressPercentage = Math.round(
    (checkedItems.length / totalItems) * 100
  )

  const handleCheckboxChange = (index: number) => {
    setCheckedItems(prev =>
      prev.includes(index)
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  useEffect(() => {
    setAllChecked(checkedItems.length === totalItems)
  }, [checkedItems, totalItems])

  const filteredItems = items.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }))

  // Calculate total filtered items
  const totalFilteredItems = filteredItems.reduce(
    (sum, section) => sum + section.items.length,
    0
  )

  return (
    <div>
      {allChecked && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          gravity={0.2}
        />
      )}

      <div
        className="mt-4"
        role="progressbar"
        aria-valuenow={progressPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Completion progress"
      >
        <div className="w-full bg-muted rounded-full h-2.5">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
            style={
              {
                width: `${progressPercentage}%`,
                '--progress': `${progressPercentage}%`,
              } as React.CSSProperties
            }
          />
        </div>
        <small className="block mt-1 text-sm text-muted-foreground">
          {progressPercentage}% Complete
        </small>
      </div>

      <Form {...form}>
        <form noValidate>
          <FormItem className="mb-4">
            <Label htmlFor="search-checklist">Search checklist</Label>
            <FormControl>
              <Input
                id="search-checklist"
                type="search"
                placeholder="Search checklist items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </FormControl>
          </FormItem>
        </form>
      </Form>

      {/* Add live region for search results */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {searchTerm
          ? `Found ${totalFilteredItems} item${
              totalFilteredItems === 1 ? '' : 's'
            } matching "${searchTerm}"`
          : ''}
      </div>

      <div className="space-y-8" role="list">
        {filteredItems.map(section => (
          <section
            key={section.title}
            className="space-y-4"
            aria-labelledby={`section-${section.title}`}
          >
            <h2
              id={`section-${section.title}`}
              className="text-2xl font-semibold"
            >
              {section.title}
            </h2>
            <ul className="space-y-2" role="list">
              {section.items.map(item => (
                <ChecklistItem
                  key={item.index}
                  index={item.index}
                  label={item.label}
                  onChange={handleCheckboxChange}
                  isChecked={checkedItems.includes(item.index)}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

interface ChecklistItemProps {
  label: string
  index: number
  onChange: (index: number) => void
  isChecked: boolean
}

function ChecklistItem({
  label,
  index,
  onChange,
  isChecked,
}: ChecklistItemProps) {
  return (
    <li className="flex items-start justify-between gap-3" role="listitem">
      <Label htmlFor={`switch-${index}`} className="flex-1 cursor-pointer">
        {label}
      </Label>
      <Switch
        id={`switch-${index}`}
        className={`mt-0.5 ${isChecked ? 'bg-green-500' : ''}`}
        checked={isChecked}
        onCheckedChange={() => onChange(index)}
        aria-checked={isChecked}
        role="switch"
        aria-label={`Mark ${label} as ${isChecked ? 'incomplete' : 'complete'}`}
      />
    </li>
  )
}
