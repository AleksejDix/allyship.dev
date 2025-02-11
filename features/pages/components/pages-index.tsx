"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { Database } from "@/database.types"
import { deletePage } from "@/features/pages/actions/delete-page"
import { formatDate } from "@/utils/date-formatting"
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
} from "@tanstack/react-table"
import { ArrowUpDown, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouterLink } from "@/components/RouterLink"

type DbDomain = Database["public"]["Tables"]["Domain"]["Row"]
type DbPage = Database["public"]["Tables"]["Page"]["Row"]
type DbScan = Database["public"]["Tables"]["Scan"]["Row"] & {
  metrics: {
    light?: {
      violations_count: number
      passes_count: number
      incomplete_count: number
      inapplicable_count: number
    }
    dark?: {
      violations_count: number
      passes_count: number
      incomplete_count: number
      inapplicable_count: number
    }
  } | null
}

type PageWithDomain = DbPage & {
  domain: DbDomain
  scans: DbScan[]
}

type Props = {
  pages: PageWithDomain[]
  domainId: string
  spaceId: string
}

export function PagesIndex({ pages, spaceId, domainId }: Props) {
  const router = useRouter()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const columns: ColumnDef<PageWithDomain>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const page = row.original

        return (
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded">
              {page.scans[0]?.screenshot_light ? (
                <Image
                  src={page.scans[0].screenshot_light}
                  alt={page.name}
                  className="object-cover"
                  fill
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                  No img
                </div>
              )}
            </div>
            <RouterLink
              href={`/spaces/${spaceId}/${domainId}/pages/${page.id}`}
              className="font-medium"
            >
              {page.name}
            </RouterLink>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const page = row.original
        const latestScan = page.scans[0]

        if (!latestScan) {
          return <Badge variant="outline">No scans</Badge>
        }

        const lightViolations = latestScan.metrics?.light?.violations_count || 0
        const darkViolations = latestScan.metrics?.dark?.violations_count || 0
        const totalViolations = lightViolations + darkViolations

        if (totalViolations === 0) {
          return <Badge variant="secondary">Passing</Badge>
        }

        if (totalViolations > 10) {
          return <Badge variant="destructive">Critical</Badge>
        }

        return <Badge variant="outline">Warning</Badge>
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const page = row.original
        return formatDate(page.created_at)
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const page = row.original

        async function handleDelete() {
          const response = await deletePage({
            pageId: page.id,
            spaceId,
            domainId,
          })

          if (response[0]?.success) {
            router.refresh()
          }
        }

        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete page</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Page</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this page? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      },
    },
  ]

  const table = useReactTable({
    data: pages,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter pages..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
