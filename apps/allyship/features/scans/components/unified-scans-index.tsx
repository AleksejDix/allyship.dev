'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Target,
  Zap,
} from 'lucide-react'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { Input } from '@workspace/ui/components/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { Tables } from '@/database.types'

type UnifiedScanResult = Tables<'unified_scan_results'>

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default'
    case 'failed':
      return 'destructive'
    case 'pending':
      return 'secondary'
    case 'scanning':
      return 'outline'
    default:
      return 'outline'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return (
        <CheckCircle aria-hidden="true" size="14" className="text-green-600" />
      )
    case 'failed':
      return <XCircle aria-hidden="true" size="14" className="text-red-600" />
    case 'pending':
      return <Clock aria-hidden="true" size="14" className="text-gray-600" />
    case 'scanning':
      return (
        <AlertCircle aria-hidden="true" size="14" className="text-blue-600" />
      )
    default:
      return <Clock aria-hidden="true" size="14" className="text-gray-600" />
  }
}

const getRiskBadgeVariant = (risk: string) => {
  switch (risk) {
    case 'low':
      return 'default'
    case 'medium':
      return 'secondary'
    case 'high':
      return 'destructive'
    case 'critical':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getRiskIcon = (risk: string) => {
  switch (risk) {
    case 'low':
      return <Shield aria-hidden="true" size="14" className="text-green-600" />
    case 'medium':
      return <Target aria-hidden="true" size="14" className="text-yellow-600" />
    case 'high':
      return (
        <AlertCircle aria-hidden="true" size="14" className="text-orange-600" />
      )
    case 'critical':
      return <Zap aria-hidden="true" size="14" className="text-red-600" />
    default:
      return <Shield aria-hidden="true" size="14" className="text-gray-600" />
  }
}

const getCoverageTypeBadge = (coverageType: string) => {
  switch (coverageType) {
    case 'comprehensive':
      return { variant: 'default' as const, label: 'Comprehensive' }
    case 'automated_only':
      return { variant: 'secondary' as const, label: 'Automated Only' }
    case 'focused_only':
      return { variant: 'outline' as const, label: 'Focused' }
    case 'not_scanned':
      return { variant: 'destructive' as const, label: 'Not Scanned' }
    default:
      return { variant: 'outline' as const, label: 'Unknown' }
  }
}

const getScanTypeBadge = (scanType: string) => {
  switch (scanType) {
    case 'axe_core':
      return { variant: 'default' as const, label: 'Axe Core' }
    case 'allystudio':
      return { variant: 'secondary' as const, label: 'AllyStudio' }
    case 'hybrid':
      return { variant: 'outline' as const, label: 'Hybrid' }
    default:
      return { variant: 'outline' as const, label: 'Unknown' }
  }
}

export function UnifiedScansIndex({ scans }: { scans: UnifiedScanResult[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Scans</h2>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Coverage</th>
              <th className="p-3 text-left">Compliance</th>
              <th className="p-3 text-left">Issues</th>
              <th className="p-3 text-left">Risk</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {scans.map(scan => (
              <tr key={scan.scan_id} className="border-b">
                <td className="p-3">{scan.scan_type}</td>
                <td className="p-3">{scan.coverage_type}</td>
                <td className="p-3">{scan.compliance_score}%</td>
                <td className="p-3">{scan.elements_failed}</td>
                <td className="p-3">{scan.risk_level}</td>
                <td className="p-3">
                  {new Date(scan.created_at!).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
