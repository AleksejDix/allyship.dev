"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type CategoryType = {
  [key: string]: readonly string[]
}

const categories: CategoryType = {
  Accessibility: [
    "a11y",
    "WAI",
    "WAI-ARIA",
    "WCAG",
    "ARIA",
    "Screen Reader",
    "Alt Text",
    "Semantic HTML",
    "Keyboard Navigation",
    "Focus Management",
    "Color Contrast",
  ],
  Development: ["CI", "CD", "API"],
  Testing: [
    "QA",
    "QC",
    "Code Coverage",
    "Regression Testing",
    "E2E",
    "Unit Testing",
  ],
  Internationalization: ["l10n"],
} as const

interface Term {
  slug: string
  title: string
  description?: string
}

interface GlossarySearchProps {
  terms: Term[]
}

export function GlossarySearch({ terms }: GlossarySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Filter terms based on search query and categories
  const filteredTerms = terms.filter((term) => {
    const matchesSearch =
      term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (term.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )

    if (selectedCategories.length === 0) {
      return matchesSearch
    }

    const categoryEntry = Object.entries(categories).find(([, termList]) =>
      termList.includes(term.title)
    )
    const category = categoryEntry?.[0] || "Other"

    return matchesSearch && selectedCategories.includes(category)
  })

  const resultCount = filteredTerms.length
  const searchResultId = "search-results"

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="relative mb-4">
          <Input
            type="search"
            placeholder="Search terms..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search glossary terms"
            aria-controls={searchResultId}
            aria-describedby="search-desc"
          />
          <div className="sr-only" id="search-desc">
            {resultCount === 0
              ? "No results found"
              : `${resultCount} result${resultCount === 1 ? "" : "s"} found`}
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by category"
        >
          {Object.keys(categories).map((category) => (
            <Button
              key={category}
              variant={
                selectedCategories.includes(category) ? "default" : "outline"
              }
              size="sm"
              onClick={() => toggleCategory(category)}
              aria-pressed={selectedCategories.includes(category)}
              className="h-7"
            >
              {category}
              {selectedCategories.includes(category) && (
                <X className="ml-1 h-3 w-3" aria-hidden="true" />
              )}
            </Button>
          ))}
        </div>
      </div>

      <div id={searchResultId}>
        <dl className="space-y-4 max-w-[65ch]">
          {filteredTerms.length === 0 ? (
            <div className="text-muted-foreground">
              No terms found matching your search
              {selectedCategories.length > 0 && " and selected categories"}.
            </div>
          ) : (
            filteredTerms.map((term) => {
              const termCategory = Object.entries(categories).find(
                ([, termList]) => termList.includes(term.title)
              )?.[0]

              return (
                <div
                  key={term.slug}
                  className="border-accent border p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-lg font-bold text-foreground">
                      {term.title}
                    </dt>
                    {termCategory && (
                      <Badge variant="secondary" className="mt-1">
                        {termCategory}
                      </Badge>
                    )}
                  </div>
                  <dd className="text-sm text-muted-foreground mt-1">
                    {term.description}
                  </dd>
                </div>
              )
            })
          )}
        </dl>
      </div>
    </div>
  )
}
