"use client"

import * as React from "react"
import { deletePage } from "@/features/pages/actions/delete-page"
import { Domain, Page } from "@prisma/client"
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

// Helper function to format dates consistently
function formatDate(date: Date | null) {
  if (!date) return "N/A"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

type PageWithDomain = Page & {
  domain: Domain
}

type Props = {
  pages: PageWithDomain[]
  domainId: string
  spaceId: string
}

function DeletePageButton({
  pageId,
  spaceId,
  domainId,
  onSuccess,
}: {
  pageId: string
  spaceId: string
  domainId: string
  onSuccess?: () => void
}) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string>()

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this page? This action cannot be undone."
    )
    if (!confirmed) return

    setIsDeleting(true)
    setError(undefined)

    try {
      const [result, error] = await deletePage({
        pageId,
        spaceId,
        domainId,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (!result?.success) {
        setError("Failed to delete page")
        return
      }

      onSuccess?.()
    } catch {
      setError("Failed to delete page")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        disabled={isDeleting}
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete page</span>
      </Button>
      {error && (
        <div className="text-xs text-destructive absolute mt-8">{error}</div>
      )}
    </div>
  )
}

export function PagesIndex({ pages: initialPages, domainId, spaceId }: Props) {
  const [pages, setPages] = React.useState<PageWithDomain[]>(initialPages)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  React.useEffect(() => {
    setPages(initialPages)
  }, [initialPages])

  const handleDeleteSuccess = React.useCallback((pageId: string) => {
    setPages((current) => current.filter((page) => page.id !== pageId))
  }, [])

  const columns = React.useMemo<ColumnDef<PageWithDomain>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Path
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const page = row.original
          return (
            <RouterLink
              href={`/spaces/${spaceId}/${domainId}/pages/${page.id}`}
              className="block hover:bg-muted/50 rounded-md transition-colors"
            >
              <div className="flex flex-col gap-1.5 py-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-background">
                    {page.domain.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">/</span>
                  <span className="text-sm font-medium text-foreground">
                    {page.name.replace(/^\//, "")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Ready</span>
                  </div>
                  <span>•</span>
                  <span>Created {formatDate(page.created_at)}</span>
                </div>
              </div>
            </RouterLink>
          )
        },
        filterFn: (row, id, value) => {
          const cellValue = row.getValue(id)?.toString() || ""
          return cellValue.toLowerCase().includes(value.toLowerCase())
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const page = row.original
          return (
            <DeletePageButton
              pageId={page.id}
              spaceId={spaceId}
              domainId={domainId}
              onSuccess={() => handleDeleteSuccess(page.id)}
            />
          )
        },
      },
    ],
    [domainId, spaceId, handleDeleteSuccess]
  )

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
    <div className="container space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by path..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                <TableCell className="h-24 text-center">
                  No pages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} page(s) total.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
