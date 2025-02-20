---
description: State management patterns and best practices
globs:
  - "**/*.{ts,tsx}"
  - "**/state/**/*"
  - "**/store/**/*"
---

# State Management Guidelines

## Server State

### React Server Components

```tsx
// Server Component
export default async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId)

  return (
    <div>
      <h1>{user.name}</h1>
      <ClientSideInteractions user={user} />
    </div>
  )
}
```

### Optimistic Updates

```tsx
"use client"

export function TodoList() {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  )

  async function addTodo(data: FormData) {
    const title = data.get("title")

    // Optimistically update UI
    addOptimisticTodo({ id: crypto.randomUUID(), title, completed: false })

    // Perform actual update
    await createTodo(title)
  }

  return (
    <form action={addTodo}>
      <input type="text" name="title" />
      <button type="submit">Add Todo</button>
      <ul>
        {optimisticTodos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </form>
  )
}
```

## Client State

### Component State

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
}
```

### Complex State

```tsx
interface State {
  todos: Todo[]
  filter: "all" | "active" | "completed"
  search: string
}

type Action =
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "TOGGLE_TODO"; payload: string }
  | { type: "SET_FILTER"; payload: State["filter"] }
  | { type: "SET_SEARCH"; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] }
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      }
    case "SET_FILTER":
      return { ...state, filter: action.payload }
    case "SET_SEARCH":
      return { ...state, search: action.payload }
    default:
      return state
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, {
    todos: [],
    filter: "all",
    search: "",
  })

  return (
    <div>
      <input
        type="text"
        value={state.search}
        onChange={(e) =>
          dispatch({ type: "SET_SEARCH", payload: e.target.value })
        }
      />
      {/* Rest of the UI */}
    </div>
  )
}
```

## Loading States

### Loading Components

```tsx
export function TableSkeleton() {
  return (
    <div role="status" aria-label="Loading content">
      <div className="animate-pulse">{/* Skeleton rows */}</div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div role="status" aria-label="Loading content">
      <div className="animate-pulse">{/* Skeleton card */}</div>
    </div>
  )
}
```

## Form State

### Form Management

```tsx
export function DataEntryForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div role="alert" aria-live="polite">
        {form.formState.errors.root?.message}
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Other form fields */}
    </form>
  )
}
```

## Data Fetching

### Server Component Data Fetching

```tsx
export async function DataDisplay() {
  const data = await fetchData()

  if (!data) {
    return <EmptyState />
  }

  return <div>{/* Data display implementation */}</div>
}
```

## State Persistence

### Local Storage

```typescript
function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue

    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}
```

## State Synchronization

### Real-time Updates

```typescript
function useRealtimeData<T>(channel: string) {
  const [data, setData] = useState<T | null>(null)

  useEffect(() => {
    const subscription = supabase
      .channel(channel)
      .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
        setData((current) => updateData(current, payload))
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [channel])

  return data
}
```

## State Reset

### Reset Patterns

```typescript
function useResetState<T>(initialState: T) {
  const [state, setState] = useState(initialState)

  const reset = useCallback(() => {
    setState(initialState)
  }, [initialState])

  return [state, setState, reset] as const
}
```
