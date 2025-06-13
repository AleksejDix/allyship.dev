'use client'

import { useState } from 'react'
import { Clock, Save } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'

type ScanFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'disabled'

interface ScanSchedule {
  id?: string
  page_id: string
  frequency: ScanFrequency
  next_scan_at?: string
  last_scan_at?: string
  is_active: boolean
}

interface Props {
  pageId: string
  currentSchedule?: ScanSchedule
  onScheduleUpdate?: (schedule: ScanSchedule) => void
}

const frequencyOptions = [
  { value: 'disabled', label: 'Disabled', description: 'No automatic scans' },
  {
    value: 'daily',
    label: 'Daily',
    description: 'Scan every day (critical pages)',
  },
  { value: 'weekly', label: 'Weekly', description: 'Scan every week' },
  { value: 'biweekly', label: 'Bi-weekly', description: 'Scan every 2 weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Scan every month' },
] as const

const getFrequencyBadgeVariant = (frequency: ScanFrequency) => {
  switch (frequency) {
    case 'daily':
      return 'destructive' // Red for critical/frequent
    case 'weekly':
      return 'default' // Blue for regular
    case 'biweekly':
      return 'secondary' // Gray for less frequent
    case 'monthly':
      return 'outline' // Outline for infrequent
    case 'disabled':
      return 'outline' // Outline for disabled
    default:
      return 'outline'
  }
}

export function ScanScheduleSettings({
  pageId,
  currentSchedule,
  onScheduleUpdate,
}: Props) {
  const [frequency, setFrequency] = useState<ScanFrequency>(
    currentSchedule?.frequency || 'disabled'
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/scan-schedule', {
        method: currentSchedule?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentSchedule?.id,
          page_id: pageId,
          frequency,
          is_active: frequency !== 'disabled',
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API Error Response:', errorData)
        throw new Error(
          `Failed to update scan schedule: ${response.status} ${response.statusText}`
        )
      }

      const updatedSchedule = await response.json()
      console.log('Schedule updated successfully:', updatedSchedule)
      onScheduleUpdate?.(updatedSchedule.data)
    } catch (error) {
      console.error('Failed to update scan schedule:', error)
      // TODO: Show user-friendly error message
    } finally {
      setIsLoading(false)
    }
  }

  const selectedOption = frequencyOptions.find(
    option => option.value === frequency
  )
  const hasChanges = frequency !== (currentSchedule?.frequency || 'disabled')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock aria-hidden="true" className="h-5 w-5" />
          Scan Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="frequency-select" className="text-sm font-medium">
            Scan Frequency
          </label>
          <Select
            value={frequency}
            onValueChange={(value: ScanFrequency) => setFrequency(value)}
          >
            <SelectTrigger id="frequency-select">
              <SelectValue placeholder="Select scan frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencyOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedOption && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Current setting:
            </span>
            <Badge variant={getFrequencyBadgeVariant(frequency)}>
              {selectedOption.label}
            </Badge>
          </div>
        )}

        {currentSchedule?.next_scan_at && frequency !== 'disabled' && (
          <div className="text-sm text-muted-foreground">
            Next scan: {new Date(currentSchedule.next_scan_at).toLocaleString()}
          </div>
        )}

        {currentSchedule?.last_scan_at && (
          <div className="text-sm text-muted-foreground">
            Last scan: {new Date(currentSchedule.last_scan_at).toLocaleString()}
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          className="w-full"
        >
          <Save aria-hidden="true" className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Schedule'}
        </Button>
      </CardContent>
    </Card>
  )
}
