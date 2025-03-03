import { Link, Link2, Loader } from "lucide-react"

export type ConnectionState = "connected" | "disconnected"

export interface ConnectorIconProps {
  state: "loading" | "connected" | "disconnected"
}

export function ConnectorIcon({ state }: ConnectorIconProps) {
  return (
    <>
      {state === "loading" && (
        <Loader className="h-3 w-3 animate-spin text-muted-foreground" />
      )}
      {state === "connected" && (
        <Link className="h-3 w-3 text-green-600 dark:text-green-400" />
      )}
      {state === "disconnected" && (
        <Link2 className="h-3 w-3 text-red-600 dark:text-red-400" />
      )}
    </>
  )
}
