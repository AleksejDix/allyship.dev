"use client"

import { useEffect, useState } from "react"
import Confetti from "react-confetti"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import type { ChecklistSection } from "../types"

interface ChecklistClientProps {
  items: ChecklistSection[]
  totalItems: number
}

export function ChecklistClient({ items, totalItems }: ChecklistClientProps) {
  const [checkedItems, setCheckedItems] = useState<number[]>([])
  const [allChecked, setAllChecked] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const progressPercentage = Math.round(
    (checkedItems.length / totalItems) * 100
  )

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    )
  }

  useEffect(() => {
    setAllChecked(checkedItems.length === totalItems)
  }, [checkedItems, totalItems])

  const filteredItems = items.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }))

  return (
    <>
      {allChecked && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          gravity={0.2}
        />
      )}

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <small className="block mt-1 text-sm text-gray-500">
          {progressPercentage}% Complete
        </small>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search checklist items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-8">
        {filteredItems.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-2xl font-semibold">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.map((item) => (
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
    </>
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
    <li className="flex items-start justify-between gap-3">
      <Label htmlFor={`switch-${index}`}>{label}</Label>
      <Switch
        id={`switch-${index}`}
        className={`mt-0.5 ${isChecked ? "bg-green-500" : ""}`}
        checked={isChecked}
        onCheckedChange={() => onChange(index)}
      />
    </li>
  )
}
