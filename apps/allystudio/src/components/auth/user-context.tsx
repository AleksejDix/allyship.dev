import { supabase } from "@/core/supabase"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"

// Define the user type based on Supabase auth
type User = {
  id: string
  email?: string
}

// Context type
type UserContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
}

// Create the context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  error: null
})

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Get the initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (data?.session?.user) {
          setUser({
            id: data.session.user.id,
            email: data.session.user.email
          })
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email
          })
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    // Clean up the subscription
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
