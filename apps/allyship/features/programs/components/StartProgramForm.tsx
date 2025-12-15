"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { getFrameworks, createProgram, type Framework } from "../actions"

type StartProgramFormProps = {
  accountId: string
  onSuccess?: () => void
}

export function StartProgramForm({ accountId, onSuccess }: StartProgramFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [selectedFramework, setSelectedFramework] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFrameworks = async () => {
      const result = await getFrameworks()
      if (result.success && result.data) {
        console.log("Frameworks loaded:", result.data)
        setFrameworks(result.data)
      } else {
        toast.error("Failed to load frameworks")
      }
      setIsLoading(false)
    }
    loadFrameworks()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedFramework) {
      toast.error("Please select a framework")
      return
    }

    setIsPending(true)

    try {
      const [data, err] = await createProgram({
        accountId,
        frameworkId: selectedFramework,
      })

      if (err) {
        toast.error(err.message || "Failed to start compliance program")
        return
      }

      toast.success("Compliance program started successfully")
      onSuccess?.()
      router.refresh()
    } catch (err) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsPending(false)
    }
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading frameworks...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <Label htmlFor="framework">Compliance Framework</Label>
        <Select
          value={selectedFramework}
          onValueChange={setSelectedFramework}
          disabled={isPending}
        >
          <SelectTrigger id="framework">
            <SelectValue placeholder="Select a framework" />
          </SelectTrigger>
          <SelectContent>
            {frameworks.map((framework) => {
              const controlCount = Number(framework.control_count) || 0
              const hasControls = controlCount > 0
              console.log(`Framework ${framework.id}: control_count=${framework.control_count}, hasControls=${hasControls}`)
              return (
                <SelectItem
                  key={framework.id}
                  value={framework.id}
                  disabled={!hasControls}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{framework.display_name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({controlCount} controls)
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {framework.jurisdiction} - {framework.compliance_type}
                    </span>
                    {!hasControls && (
                      <span className="text-xs text-red-600">No controls configured</span>
                    )}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {selectedFramework && (
          <div className="text-xs text-muted-foreground mt-2">
            {frameworks.find((f) => f.id === selectedFramework)?.description}
          </div>
        )}
      </div>
      <Button type="submit" disabled={isPending || !selectedFramework}>
        {isPending ? "Starting..." : "Start Program"}
      </Button>
    </form>
  )
}
