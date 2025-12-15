import type { ProgramControl } from "../actions"
import { ControlStatusBadge } from "./ControlStatusBadge"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ControlsListProps = {
  controls: ProgramControl[]
}

export function ControlsList({ controls }: ControlsListProps) {
  // Calculate summary stats
  const stats = controls.reduce(
    (acc, control) => {
      const latestCheck = control.checks[0]
      const status = latestCheck?.status || "not_checked"
      acc[status] = (acc[status] || 0) + 1
      acc.total++
      return acc
    },
    { total: 0, pass: 0, fail: 0, warning: 0, not_checked: 0, pending: 0 } as Record<
      string,
      number
    >
  )

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total Controls</div>
        </div>
        <div className="border rounded-lg p-4 bg-green-50">
          <div className="text-2xl font-bold text-green-800">{stats.pass || 0}</div>
          <div className="text-xs text-green-600">Passing</div>
        </div>
        <div className="border rounded-lg p-4 bg-red-50">
          <div className="text-2xl font-bold text-red-800">{stats.fail || 0}</div>
          <div className="text-xs text-red-600">Failing</div>
        </div>
        <div className="border rounded-lg p-4 bg-yellow-50">
          <div className="text-2xl font-bold text-yellow-800">{stats.warning || 0}</div>
          <div className="text-xs text-yellow-600">Warnings</div>
        </div>
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="text-2xl font-bold text-gray-800">{stats.not_checked || 0}</div>
          <div className="text-xs text-gray-600">Not Checked</div>
        </div>
      </div>

      {/* Controls Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Control ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px]">Last Checked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {controls.map((control) => {
              const latestCheck = control.checks[0]
              const status = latestCheck?.status || "not_checked"

              return (
                <TableRow key={control.id}>
                  <TableCell className="font-mono text-sm">
                    {control.control.id}
                  </TableCell>
                  <TableCell className="font-medium">{control.control.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {control.control.description}
                  </TableCell>
                  <TableCell>
                    {latestCheck ? (
                      <Badge variant="outline" className="text-xs">
                        {latestCheck.check_type}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <ControlStatusBadge status={status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {latestCheck?.last_checked_at
                      ? new Date(latestCheck.last_checked_at).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
