---
description: Animation patterns and best practices
globs: "**/*.{ts,tsx}"
---

# Animation Guidelines

## Core Principles

### Framer Motion Components

✅ Use Framer Motion for complex animations:

```tsx
// components/animated-dialog.tsx
import { AnimatePresence, motion } from "framer-motion"

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function AnimatedDialog({ isOpen, onClose, children }: DialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-4 top-[10vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-md rounded-lg bg-white p-6"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### CSS Transitions

✅ Use CSS transitions for simple animations:

```tsx
// components/collapsible.tsx
interface CollapsibleProps {
  isOpen: boolean
  children: React.ReactNode
}

export function Collapsible({ isOpen, children }: CollapsibleProps) {
  return (
    <div
      className={cn(
        "grid transition-all duration-200",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

// Usage
export function FAQ() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full"
      >
        <span>What is this?</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <Collapsible isOpen={isOpen}>
        <div className="p-4">This is the answer to your question.</div>
      </Collapsible>
    </div>
  )
}
```

## List Animations

### Animated Lists

✅ Animate list changes:

```tsx
// components/animated-list.tsx
import { AnimatePresence, motion } from "framer-motion"

interface AnimatedListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  getKey: (item: T) => string | number
}

export function AnimatedList<T>({
  items,
  renderItem,
  getKey,
}: AnimatedListProps<T>) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={getKey(item)}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 350,
            }}
          >
            {renderItem(item)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Usage
export function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <AnimatedList
      items={todos}
      getKey={(todo) => todo.id}
      renderItem={(todo) => (
        <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
          <Checkbox checked={todo.completed} />
          <span>{todo.title}</span>
        </div>
      )}
    />
  )
}
```

## Page Transitions

### Route Transitions

✅ Animate route changes:

```tsx
// app/template.tsx
"use client"

import { motion } from "framer-motion"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 350,
      }}
    >
      {children}
    </motion.main>
  )
}
```

## Loading Animations

### Loading Spinners

✅ Create reusable loading animations:

```tsx
// components/spinner.tsx
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Usage with size variants
export function LoadingButton({
  loading,
  children,
  size = "default",
}: {
  loading?: boolean
  children: React.ReactNode
  size?: "sm" | "default" | "lg"
}) {
  return (
    <button
      disabled={loading}
      className={cn(
        "inline-flex items-center justify-center",
        loading && "cursor-not-allowed opacity-50"
      )}
    >
      {loading && (
        <Spinner
          className={cn(
            "mr-2",
            size === "sm" && "h-3 w-3",
            size === "default" && "h-4 w-4",
            size === "lg" && "h-5 w-5"
          )}
        />
      )}
      {children}
    </button>
  )
}
```

## Hover Animations

### Interactive Cards

✅ Create engaging hover effects:

```tsx
// components/interactive-card.tsx
export function InteractiveCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative rounded-lg border p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        "before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-gradient-to-r before:from-primary/10 before:to-primary/5 before:opacity-0 before:transition-opacity hover:before:opacity-100",
        className
      )}
    >
      {children}
    </div>
  )
}

// Usage
export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <InteractiveCard>
      <div className="relative">
        <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </InteractiveCard>
  )
}
```

## Scroll Animations

### Scroll-Triggered Animations

✅ Animate elements on scroll:

```tsx
// hooks/use-scroll-animation.ts
import { useRef } from "react"
import { useInView } from "framer-motion"

export function useScrollAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return { ref, isInView }
}

// Usage
export function ScrollAnimatedSection({
  children,
}: {
  children: React.ReactNode
}) {
  const { ref, isInView } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
```

## Accessibility

### Reduced Motion

✅ Respect user preferences:

```tsx
// hooks/use-reduced-motion.ts
import { useEffect, useState } from "react"

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", onChange)
    return () => {
      mediaQuery.removeEventListener("change", onChange)
    }
  }, [])

  return prefersReducedMotion
}

// Usage
export function AnimatedComponent({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  const animation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
      }

  return <motion.div {...animation}>{children}</motion.div>
}
```
