"use client"

import { cn } from "@/lib/utils"
import {
  Bell,
  Code2,
  Contrast,
  FileText,
  FormInput,
  Keyboard,
  Languages,
  LayoutTemplate,
  MousePointer2,
  MousePointerClick,
  Navigation,
  Timer,
  Video,
  Zap
} from "lucide-react"
import type { ComponentType } from "react"
import { useState } from "react"

import { Button } from "./ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip"

type WCAGLevel = "A" | "AA" | "AAA"
type WCAGPrinciple = "perceivable" | "operable" | "understandable" | "robust"

type Tool = {
  id: string
  name: string
  icon: ComponentType
  shortcut: string
  description: string
  wcagLevel: WCAGLevel
  wcagCriteria: string
  category: WCAGPrinciple
}

const tools: Tool[] = [
  // 1. Perceivable
  {
    id: "text-alternatives",
    name: "Text Alternatives",
    icon: FileText,
    shortcut: "T",
    description: "Check non-text content for alternatives",
    wcagLevel: "A",
    wcagCriteria: "1.1.1",
    category: "perceivable"
  },
  {
    id: "time-based-media",
    name: "Media",
    icon: Video,
    shortcut: "M",
    description: "Analyze audio and video content",
    wcagLevel: "A",
    wcagCriteria: "1.2.1-1.2.9",
    category: "perceivable"
  },
  {
    id: "adaptable",
    name: "Structure",
    icon: LayoutTemplate,
    shortcut: "S",
    description: "Verify content structure and relationships",
    wcagLevel: "A",
    wcagCriteria: "1.3.1-1.3.6",
    category: "perceivable"
  },
  {
    id: "distinguishable",
    name: "Contrast",
    icon: Contrast,
    shortcut: "C",
    description: "Check color contrast and visual presentation",
    wcagLevel: "AA",
    wcagCriteria: "1.4.1-1.4.13",
    category: "perceivable"
  },
  // 2. Operable
  {
    id: "keyboard",
    name: "Keyboard",
    icon: Keyboard,
    shortcut: "K",
    description: "Test keyboard accessibility",
    wcagLevel: "A",
    wcagCriteria: "2.1.1-2.1.4",
    category: "operable"
  },
  {
    id: "timing",
    name: "Timing",
    icon: Timer,
    shortcut: "I",
    description: "Check time limits and interactions",
    wcagLevel: "A",
    wcagCriteria: "2.2.1-2.2.6",
    category: "operable"
  },
  {
    id: "seizures",
    name: "Motion",
    icon: Zap,
    shortcut: "Z",
    description: "Test for flashing content",
    wcagLevel: "A",
    wcagCriteria: "2.3.1-2.3.3",
    category: "operable"
  },
  {
    id: "navigation",
    name: "Navigation",
    icon: Navigation,
    shortcut: "N",
    description: "Analyze navigation and wayfinding",
    wcagLevel: "A",
    wcagCriteria: "2.4.1-2.4.10",
    category: "operable"
  },
  {
    id: "input-modalities",
    name: "Input",
    icon: MousePointer2,
    shortcut: "P",
    description: "Check pointer and touch interactions",
    wcagLevel: "A",
    wcagCriteria: "2.5.1-2.5.6",
    category: "operable"
  },
  // 3. Understandable
  {
    id: "readable",
    name: "Language",
    icon: Languages,
    shortcut: "L",
    description: "Check text readability and language",
    wcagLevel: "A",
    wcagCriteria: "3.1.1-3.1.6",
    category: "understandable"
  },
  {
    id: "predictable",
    name: "Behavior",
    icon: MousePointerClick,
    shortcut: "B",
    description: "Verify predictable behaviors",
    wcagLevel: "A",
    wcagCriteria: "3.2.1-3.2.5",
    category: "understandable"
  },
  {
    id: "input-assistance",
    name: "Forms",
    icon: FormInput,
    shortcut: "F",
    description: "Test form validation and assistance",
    wcagLevel: "A",
    wcagCriteria: "3.3.1-3.3.6",
    category: "understandable"
  },
  // 4. Robust
  {
    id: "compatible",
    name: "Parsing",
    icon: Code2,
    shortcut: "R",
    description: "Check markup and compatibility",
    wcagLevel: "A",
    wcagCriteria: "4.1.1-4.1.3",
    category: "robust"
  },
  {
    id: "status",
    name: "Status",
    icon: Bell,
    shortcut: "U",
    description: "Verify status messages",
    wcagLevel: "AA",
    wcagCriteria: "4.1.3",
    category: "robust"
  }
]

const wcagPrinciples: WCAGPrinciple[] = [
  "perceivable",
  "operable",
  "understandable",
  "robust"
]

interface ToolbarProps {
  onToolChange?: (tool: string) => void
}

export function Toolbar({ onToolChange }: ToolbarProps) {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] =
    useState<WCAGPrinciple>("perceivable")

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId === activeTool ? null : toolId)
    onToolChange?.(toolId === activeTool ? "" : toolId)
  }

  const filteredTools = tools.filter((tool) => tool.category === activeCategory)

  return (
    <TooltipProvider>
      <div className="flex h-[72px] w-full flex-col border-b bg-muted/50">
        {/* Category Tabs */}
        <div className="flex h-[24px] gap-1 border-b px-1 text-[10px]">
          {wcagPrinciples.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-2 capitalize",
                activeCategory === category &&
                  "bg-primary text-primary-foreground rounded-t"
              )}>
              {category}
            </button>
          ))}
        </div>
        {/* Tools */}
        <div className="flex h-[48px] items-center gap-0.5 px-1">
          {filteredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded relative",
                      activeTool === tool.id &&
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    )}
                    onClick={() => handleToolClick(tool.id)}>
                    <span className="sr-only">{tool.name}</span>
                    <Icon className="h-4 w-4" />
                    <span
                      className={cn(
                        "absolute -top-0.5 -right-0.5 text-[8px] font-bold",
                        tool.wcagLevel === "A" &&
                          "text-green-600 dark:text-green-400",
                        tool.wcagLevel === "AA" &&
                          "text-blue-600 dark:text-blue-400",
                        tool.wcagLevel === "AAA" &&
                          "text-purple-600 dark:text-purple-400"
                      )}>
                      {tool.wcagLevel}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="flex items-center gap-2 py-1.5 px-2">
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium leading-none">
                        {tool.name}
                      </p>
                      <span className="rounded bg-primary/10 px-1 text-[10px] font-medium">
                        {tool.wcagCriteria}
                      </span>
                    </div>
                    <p className="text-[10px] leading-tight text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                  <kbd className="pointer-events-none ml-auto inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground">
                    {tool.shortcut}
                  </kbd>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
