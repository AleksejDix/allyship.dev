---
description: Component composition patterns and best practices
globs: "**/*.{ts,tsx}"
---

# Component Composition Guidelines

## Core Principles

### Compound Components

✅ Use compound components for complex UIs:

```tsx
// components/select/index.tsx
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"

const Select = SelectPrimitive.Root

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

// Usage
export function UserSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">John Doe</SelectItem>
        <SelectItem value="2">Jane Smith</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### Render Props

✅ Use render props for flexible components:

```tsx
// components/data-table/index.tsx
interface DataTableProps<T> {
  data: T[]
  renderItem: (item: T) => React.ReactNode
  renderEmpty?: () => React.ReactNode
  renderLoading?: () => React.ReactNode
  isLoading?: boolean
}

export function DataTable<T>({
  data,
  renderItem,
  renderEmpty = () => <EmptyState />,
  renderLoading = () => <TableSkeleton />,
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return renderLoading()
  }

  if (!data.length) {
    return renderEmpty()
  }

  return (
    <div className="rounded-md border">
      {data.map((item, index) => (
        <div key={index} className="border-b p-4 last:border-0">
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}

// Usage
export function UserTable({ users }: { users: User[] }) {
  return (
    <DataTable
      data={users}
      renderItem={(user) => (
        <div className="flex items-center gap-4">
          <Avatar user={user} />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      )}
      renderEmpty={() => (
        <EmptyState
          title="No users found"
          description="Try adjusting your filters"
        />
      )}
    />
  )
}
```

### Higher-Order Components

✅ Use HOCs for cross-cutting concerns:

```tsx
// components/with-auth.tsx
export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function WithAuthComponent(props: T) {
    const { user, isLoading } = useUser()

    if (isLoading) {
      return <LoadingSpinner />
    }

    if (!user) {
      redirect("/login")
    }

    return <WrappedComponent {...props} />
  }
}

// Usage
function AdminDashboard() {
  return <div>Admin only content</div>
}

export default withAuth(AdminDashboard)
```

## Layout Components

### Grid Layout

✅ Create reusable grid layouts:

```tsx
// components/grid.tsx
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  columns?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
}

export function Grid({
  children,
  columns = { default: 1 },
  gap = 4,
  className,
  ...props
}: GridProps) {
  const gridClasses = cn(
    "grid",
    `grid-cols-${columns.default}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    `gap-${gap}`,
    className
  )

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  )
}

// Usage
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <Grid
      columns={{
        default: 1,
        sm: 2,
        md: 3,
        lg: 4,
      }}
      gap={6}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Grid>
  )
}
```

### Stack Layout

✅ Create flexible stack layouts:

```tsx
// components/stack.tsx
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  direction?: "row" | "column"
  spacing?: number
  align?: "start" | "center" | "end"
  justify?: "start" | "center" | "end" | "between"
  wrap?: boolean
}

export function Stack({
  children,
  direction = "column",
  spacing = 4,
  align = "start",
  justify = "start",
  wrap = false,
  className,
  ...props
}: StackProps) {
  const stackClasses = cn(
    direction === "row" ? "flex" : "flex flex-col",
    `gap-${spacing}`,
    `items-${align}`,
    `justify-${justify}`,
    wrap && "flex-wrap",
    className
  )

  return (
    <div className={stackClasses} {...props}>
      {children}
    </div>
  )
}

// Usage
export function UserProfile({ user }: { user: User }) {
  return (
    <Stack spacing={6}>
      <Stack direction="row" spacing={4} align="center">
        <Avatar user={user} />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground">{user.bio}</p>
        </div>
      </Stack>
      <Stack spacing={2}>
        <h3 className="font-semibold">Contact</h3>
        <p>{user.email}</p>
        <p>{user.phone}</p>
      </Stack>
    </Stack>
  )
}
```

## Component Props

### Prop Collections

✅ Use prop collections for common patterns:

```tsx
// hooks/use-dialog.ts
export function useDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const dialogProps = {
    open: isOpen,
    onOpenChange: setIsOpen,
  }

  const triggerProps = {
    onClick: () => setIsOpen(true),
    "aria-expanded": isOpen,
  }

  const contentProps = {
    onEscapeKeyDown: () => setIsOpen(false),
    onPointerDownOutside: () => setIsOpen(false),
  }

  return {
    isOpen,
    dialogProps,
    triggerProps,
    contentProps,
  }
}

// Usage
export function DeleteDialog() {
  const { dialogProps, triggerProps, contentProps } = useDialog()

  return (
    <Dialog {...dialogProps}>
      <DialogTrigger {...triggerProps}>Delete</DialogTrigger>
      <DialogContent {...contentProps}>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

### Prop Getters

✅ Use prop getters for flexible props:

```tsx
// hooks/use-clipboard.ts
export function useClipboard() {
  const [copied, setCopied] = useState(false)

  const getButtonProps = ({
    onClick,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> = {}) => ({
    onClick: async (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error("Failed to copy text:", error)
      }
    },
    "aria-label": copied ? "Copied!" : "Copy to clipboard",
    ...props,
  })

  return {
    copied,
    getButtonProps,
  }
}

// Usage
export function CopyButton({ text }: { text: string }) {
  const { copied, getButtonProps } = useClipboard()

  return (
    <button
      {...getButtonProps({
        className: cn(
          "rounded-md px-2 py-1",
          copied && "bg-green-100 text-green-800"
        ),
      })}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  )
}
```

## State Composition

### Context Composition

✅ Compose multiple contexts:

```tsx
// contexts/app-providers.tsx
interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

// Usage
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
```

### Custom Hooks Composition

✅ Compose multiple hooks:

```tsx
// hooks/use-post-form.ts
export function usePostForm() {
  const form = useForm<PostFormValues>()
  const { user } = useUser()
  const { mutate } = useCreatePost()
  const { toast } = useToast()

  const onSubmit = async (values: PostFormValues) => {
    try {
      await mutate({
        ...values,
        userId: user.id,
      })
      toast({
        title: "Success",
        description: "Post created successfully",
      })
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    }
  }

  return {
    form,
    onSubmit,
  }
}

// Usage
export function PostForm() {
  const { form, onSubmit } = usePostForm()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
    </Form>
  )
}
```
