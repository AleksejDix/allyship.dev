"use client"

import { useEffect, useRef, useState } from "react"
import {
  Check,
  FormInput,
  GripHorizontal,
  Image,
  Info,
  Keyboard,
  LayoutTemplate,
  MousePointer2,
  Palette,
  Settings,
  Type,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { checkAriaRoles } from "./tools/aria-roles"
import { checkColorContrast } from "./tools/color-contrast"
import { checkFocusOrder } from "./tools/focus-order"
import { checkFormLabels } from "./tools/form-labels"
import { checkHeadings } from "./tools/heading-structure"
import { checkImageAlt } from "./tools/image-alt"
import { checkKeyboardShortcuts } from "./tools/keyboard-shortcuts"
import { checkLandmarks } from "./tools/landmarks"

interface Tool {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  isActive: boolean
  run: () => void
  options?: {
    // Add tool-specific options here
    label: string
    value: string | number | boolean
    type: "checkbox" | "radio" | "select" | "range"
  }[]
}

const CORE_TOOLS: Tool[] = [
  {
    id: "headings",
    name: "Headings",
    icon: <Type className="h-4 w-4" />,
    description: "Check heading order and structure",
    isActive: false,
    run: checkHeadings,
  },
  {
    id: "landmarks",
    name: "Landmarks",
    icon: <LayoutTemplate className="h-4 w-4" />,
    description: "Validate page landmarks and regions",
    isActive: false,
    run: checkLandmarks,
  },
  {
    id: "aria",
    name: "ARIA Roles",
    icon: <Settings className="h-4 w-4" />,
    description: "Validate ARIA usage",
    isActive: false,
    run: checkAriaRoles,
  },
  {
    id: "focus",
    name: "Focus Order",
    icon: <MousePointer2 className="h-4 w-4" />,
    description: "Track keyboard focus order",
    isActive: false,
    run: checkFocusOrder,
  },
  {
    id: "keyboard",
    name: "Keyboard",
    icon: <Keyboard className="h-4 w-4" />,
    description: "Check keyboard access",
    isActive: false,
    run: checkKeyboardShortcuts,
  },
  {
    id: "labels",
    name: "Form Labels",
    icon: <FormInput className="h-4 w-4" />,
    description: "Validate form controls",
    isActive: false,
    run: checkFormLabels,
  },
  {
    id: "contrast",
    name: "Contrast",
    icon: <Palette className="h-4 w-4" />,
    description: "Check color contrast",
    isActive: false,
    run: checkColorContrast,
  },
  {
    id: "images",
    name: "Images",
    icon: <Image className="h-4 w-4" />,
    description: "Check image accessibility",
    isActive: false,
    run: checkImageAlt,
  },
]

interface Position {
  x: number
  y: number
}

// First, let's define tool groups with their variants
const TOOL_GROUPS = [
  {
    id: "structure",
    label: "Structure Tools",
    tools: [
      {
        id: "headings",
        name: "Headings",
        icon: <Type className="h-4 w-4" />,
        description: "Check heading structure",
        run: checkHeadings,
      },
      {
        id: "landmarks",
        name: "Landmarks",
        icon: <LayoutTemplate className="h-4 w-4" />,
        description: "Check page regions",
        run: checkLandmarks,
      },
      {
        id: "aria",
        name: "ARIA Roles",
        icon: <Settings className="h-4 w-4" />,
        description: "Check ARIA usage",
        run: checkAriaRoles,
      },
    ],
  },
  {
    id: "interaction",
    label: "Interaction Tools",
    tools: [
      {
        id: "focus",
        name: "Focus Order",
        icon: <MousePointer2 className="h-4 w-4" />,
        description: "Track focus path",
        run: checkFocusOrder,
      },
      {
        id: "keyboard",
        name: "Keyboard Access",
        icon: <Keyboard className="h-4 w-4" />,
        description: "Check keyboard support",
        run: checkKeyboardShortcuts,
      },
    ],
  },
  {
    id: "labels",
    label: "Labels",
    tools: [
      {
        id: "labels",
        name: "Form Labels",
        icon: <FormInput className="h-4 w-4" />,
        description: "Validate form controls",
        run: checkFormLabels,
      },
    ],
  },
  {
    id: "contrast",
    label: "Contrast",
    tools: [
      {
        id: "contrast",
        name: "Contrast",
        icon: <Palette className="h-4 w-4" />,
        description: "Check color contrast",
        run: checkColorContrast,
      },
    ],
  },
  {
    id: "images",
    label: "Images",
    tools: [
      {
        id: "images",
        name: "Images",
        icon: <Image className="h-4 w-4" />,
        description: "Check image accessibility",
        run: checkImageAlt,
      },
    ],
  },
] as const

export function AccessibilityToolbar() {
  // Track active tool per group
  const [activeTools, setActiveTools] = useState<Record<string, string>>({})
  const dragRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Center vertically on mount
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect()
      const centerY = Math.max(16, (window.innerHeight - rect.height) / 2)
      dragRef.current.style.top = `${centerY}px`
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return

    // Prevent default drag ghost image
    e.preventDefault()
    isDragging.current = true

    // Calculate offset from mouse to toolbar corner
    const rect = dragRef.current.getBoundingClientRect()
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }

    // Add dragging styles
    dragRef.current.classList.add("dragging")
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !dragRef.current) return

    // Calculate new position
    const x = Math.max(
      16,
      Math.min(
        e.clientX - dragOffset.current.x,
        window.innerWidth - dragRef.current.offsetWidth - 16
      )
    )
    const y = Math.max(
      16,
      Math.min(
        e.clientY - dragOffset.current.y,
        window.innerHeight - dragRef.current.offsetHeight - 16
      )
    )

    // Update position
    dragRef.current.style.left = `${x}px`
    dragRef.current.style.top = `${y}px`
  }

  const handleMouseUp = () => {
    if (!dragRef.current) return

    isDragging.current = false
    dragRef.current.classList.remove("dragging")
  }

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const toggleTool = (groupId: string, toolId: string) => {
    setActiveTools((prev) => {
      const newTools = { ...prev }

      // If clicking active tool, disable it
      if (prev[groupId] === toolId) {
        // Run the tool to disable it
        const tool = TOOL_GROUPS.find((g) => g.id === groupId)?.tools.find(
          (t) => t.id === toolId
        )
        if (tool) tool.run()
        delete newTools[groupId]
      } else {
        // Disable previous tool in group if exists
        if (prev[groupId]) {
          const prevTool = TOOL_GROUPS.find(
            (g) => g.id === groupId
          )?.tools.find((t) => t.id === prev[groupId])
          if (prevTool) prevTool.run()
        }
        // Enable new tool
        const tool = TOOL_GROUPS.find((g) => g.id === groupId)?.tools.find(
          (t) => t.id === toolId
        )
        if (tool) tool.run()
        newTools[groupId] = toolId
      }

      return newTools
    })
  }

  const getDropdownPosition = (buttonRect: DOMRect) => {
    if (!dragRef.current) return "right"
    const toolbarRect = dragRef.current.getBoundingClientRect()
    const spaceRight = window.innerWidth - buttonRect.right
    const spaceLeft = buttonRect.left
    const spaceTop = buttonRect.top
    const spaceBottom = window.innerHeight - buttonRect.bottom

    // Return the direction with most space
    const spaces = [
      { dir: "right", space: spaceRight },
      { dir: "left", space: spaceLeft },
      { dir: "top", space: spaceTop },
      { dir: "bottom", space: spaceBottom },
    ]
    return spaces.reduce((a, b) => (a.space > b.space ? a : b)).dir
  }

  return (
    <div
      ref={dragRef}
      className={cn(
        "fixed left-4 bg-background border rounded-lg shadow-lg p-2",
        "select-none transition-colors duration-75",
        "hover:shadow-xl",
        "dragging:opacity-90",
        "w-[48px]"
      )}
      style={{ zIndex: 50 }}
    >
      {/* Drag Handle */}
      <div
        className="w-full p-2 cursor-grab hover:bg-muted rounded-md active:cursor-grabbing mb-2 flex justify-center"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 gap-1">
        {TOOL_GROUPS.map((group) => (
          <DropdownMenu key={group.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeTools[group.id] ? "default" : "ghost"}
                size="icon"
                className="relative w-full h-8"
              >
                {/* Show active tool icon or first tool icon */}
                {group.tools.find((t) => t.id === activeTools[group.id])
                  ?.icon || group.tools[0].icon}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
              <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {group.tools.map((tool) => (
                <DropdownMenuItem
                  key={tool.id}
                  onClick={() => toggleTool(group.id, tool.id)}
                  className="flex items-center gap-2"
                >
                  {tool.icon}
                  <span>{tool.name}</span>
                  {activeTools[group.id] === tool.id && (
                    <Check className="h-4 w-4 ml-auto" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  )
}
