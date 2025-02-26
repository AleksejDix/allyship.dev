'use client'

import { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Check,
  Contrast,
  Crosshair,
  ExternalLink,
  FormInput,
  GripHorizontal,
  Image as ImageIcon,
  Keyboard,
  Languages,
  LayoutTemplate,
  Link,
  Settings,
  SquareAsterisk,
  Type,
  Brain,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'

import { checkAriaRoles } from './tools/aria-roles'
import { checkColorContrast } from './tools/color-contrast'
import { checkCursorRules } from './tools/cursor-rule'
import { checkExternalLinks } from './tools/external-links'
import { checkFocusOrder } from './tools/focus-order'
import { checkFormLabels } from './tools/form-labels'
import { checkHeadings } from './tools/heading-structure'
import { checkImageAlt } from './tools/image-alt'
import { checkKeyboardAccessibility } from './tools/keyboard-accessibility'
import { checkKeyboardShortcuts } from './tools/keyboard-shortcuts'
import { checkLandmarks } from './tools/landmarks'
import { checkLanguage } from './tools/language-check'
import { checkLinkLabels } from './tools/link-labels'
import { checkReadability } from './ai-tools'

const TOOLS = {
  headings: {
    id: 'headings',
    name: 'Headings',
    icon: <Type className="h-4 w-4" />,
    description: 'Check heading structure and hierarchy',
    wcagCriteria: ['1.3.1', '2.4.6'],
    run: checkHeadings,
  },
  landmarks: {
    id: 'landmarks',
    name: 'Landmarks',
    icon: <LayoutTemplate className="h-4 w-4" />,
    description: 'Validate page landmarks and regions',
    wcagCriteria: ['1.3.1', '2.4.1'],
    run: checkLandmarks,
  },
  aria: {
    id: 'aria',
    name: 'ARIA Roles',
    icon: <Settings className="h-4 w-4" />,
    description: 'Validate ARIA usage',
    run: checkAriaRoles,
  },
  focus: {
    id: 'focus',
    name: 'Focus Order',
    icon: <Crosshair className="h-4 w-4" />,
    description: 'Track keyboard focus order',
    wcagCriteria: ['2.4.3', '2.4.7'],
    run: checkFocusOrder,
  },
  keyboard: {
    id: 'keyboard',
    name: 'Keyboard Access',
    icon: <Keyboard className="h-4 w-4" />,
    description: 'Check keyboard accessibility',
    run: checkKeyboardAccessibility,
  },
  shortcuts: {
    id: 'keyboardShortcuts',
    name: 'Keyboard Shortcuts',
    icon: <SquareAsterisk className="h-4 w-4" />,
    description: 'Check keyboard shortcuts and access',
    run: checkKeyboardShortcuts,
  },
  formLabels: {
    id: 'formLabels',
    name: 'Form Labels',
    icon: <FormInput className="h-4 w-4" />,
    description: 'Check form control labels and instructions',
    wcagCriteria: ['1.3.1', '3.3.2', '4.1.2'],
    run: checkFormLabels,
  },
  contrast: {
    id: 'contrast',
    name: 'Contrast',
    icon: <Contrast className="h-4 w-4" />,
    description: 'Check color contrast ratios',
    run: checkColorContrast,
  },
  images: {
    id: 'images',
    name: 'Images',
    icon: <ImageIcon className="h-4 w-4" />,
    description: 'Check image accessibility',
    run: checkImageAlt,
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor Rules',
    icon: <Crosshair className="h-4 w-4" />,
    description: 'Check cursor rules',
    run: checkCursorRules,
  },
  linkLabels: {
    id: 'linkLabels',
    name: 'Link Labels',
    icon: <Link className="h-4 w-4" />,
    description: 'Check for consistent link labels',
    run: checkLinkLabels,
  },
  language: {
    id: 'language',
    name: 'Language',
    icon: <Languages className="h-4 w-4" />,
    description: 'Check HTML language attributes',
    run: checkLanguage,
  },
  imageAlt: {
    id: 'imageAlt',
    name: 'Image Alt',
    icon: <ImageIcon className="h-4 w-4" />,
    description: 'Check image alt text',
    run: checkImageAlt,
  },
  readableText: {
    id: 'readableText',
    name: 'Readable Text',
    icon: <BookOpen className="h-4 w-4" />,
    description: 'Ensure text is readable and understandable',
    wcagCriteria: ['3.1.5'],
  },
  externalLinks: {
    id: 'externalLinks',
    name: 'External Links',
    icon: <ExternalLink className="h-4 w-4" />,
    description: 'Check external links for new window warnings',
    wcagCriteria: ['3.2.5'],
    run: checkExternalLinks,
  },
  readability: {
    id: 'readability',
    name: 'AI Readability',
    icon: <BookOpen className="h-4 w-4 text-blue-500" />,
    description: 'Check text readability with AI',
    run: checkReadability,
  },
} as const

const TOOL_GROUPS = [
  {
    id: 'structure',
    label: 'Structure',
    tools: [TOOLS.headings, TOOLS.landmarks, TOOLS.aria],
  },
  {
    id: 'interaction',
    label: 'Interaction',
    tools: [TOOLS.focus, TOOLS.keyboard, TOOLS.shortcuts],
  },
  {
    id: 'forms',
    label: 'Forms',
    tools: [TOOLS.formLabels],
  },
  {
    id: 'visual',
    label: 'Design',
    tools: [TOOLS.contrast, TOOLS.imageAlt, TOOLS.cursor],
  },
  {
    id: 'links',
    label: 'Links',
    tools: [TOOLS.linkLabels, TOOLS.externalLinks],
  },
  {
    id: 'content',
    label: 'Language',
    tools: [TOOLS.language],
  },
  {
    id: 'ai',
    label: 'AI Tools',
    tools: [TOOLS.readability],
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
    dragRef.current.classList.add('dragging')
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
    dragRef.current.classList.remove('dragging')
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const toggleTool = (groupId: string, toolId: string) => {
    setActiveTools(prev => {
      const newTools = { ...prev }
      const isCurrentlyActive = prev[groupId] === toolId

      if (isCurrentlyActive) {
        // Disable currently active tool
        const tool = TOOL_GROUPS.find(g => g.id === groupId)?.tools.find(
          t => t.id === toolId
        )
        if (tool) {
          const result = tool.run('cleanup')
          if (result && 'success' in result && result.success) {
            delete newTools[groupId]
          }
        }
      } else {
        // Disable previous tool in group if exists
        if (prev[groupId]) {
          const prevTool = TOOL_GROUPS.find(g => g.id === groupId)?.tools.find(
            t => t.id === prev[groupId]
          )
          if (prevTool) {
            prevTool.run('cleanup')
          }
        }

        // Enable new tool
        const tool = TOOL_GROUPS.find(g => g.id === groupId)?.tools.find(
          t => t.id === toolId
        )
        if (tool) {
          const result = tool.run('apply')
          if (result && 'success' in result && result.success) {
            newTools[groupId] = toolId
          }
        }
      }

      return newTools
    })
  }

  return (
    <div
      ref={dragRef}
      className={cn(
        'fixed left-4 bg-background border rounded-lg shadow-lg p-2',
        'select-none transition-colors duration-75',
        'hover:shadow-xl',
        'dragging:opacity-90',
        'w-[48px]'
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
        {TOOL_GROUPS.map(group => (
          <DropdownMenu key={group.id}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={activeTools[group.id] ? 'default' : 'ghost'}
                size="icon"
                className="relative w-full h-8"
              >
                {/* Show active tool icon or first tool icon */}
                {group.tools.find(t => t.id === activeTools[group.id])?.icon ||
                  group.tools[0].icon}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right">
              <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {group.tools.map(tool => (
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
