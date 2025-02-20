'use client'

import { useEffect, useRef, useState } from 'react'
import wcagData from '@/data/wcag-data.json'
import { Check, X } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'

export function A11yMatrix() {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableHeight, setTableHeight] = useState(1000)

  useEffect(() => {
    const updateHeight = () => {
      if (tableRef.current) {
        setTableHeight(tableRef.current.scrollHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  return (
    <div
      ref={tableRef}
      className="overflow-x-auto border border-border rounded-md [&_td:hover]:bg-muted [&_td:hover]:cursor-default"
    >
      <Table>
        <TableCaption className="mb-4 text-2xl font-bold">
          Accessibility Criteria Matrix
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=" group">
              <div className="relative">
                <div
                  className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                />
                Success Criteria
              </div>
            </TableHead>
            <TableHead>Allyship</TableHead>
            <TableHead className="whitespace-nowrap">WCAG 2.1 A</TableHead>
            <TableHead className="whitespace-nowrap">WCAG 2.1 AA</TableHead>
            <TableHead className="whitespace-nowrap">WCAG 2.2 A</TableHead>
            <TableHead className="whitespace-nowrap">WCAG 2.2 AA</TableHead>
            <TableHead className="whitespace-nowrap">Section 508</TableHead>
            <TableHead className="whitespace-nowrap">EN 301 549</TableHead>
            <TableHead className="whitespace-nowrap">Best Practice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wcagData.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <div> {row.criterion}</div>
                  <div>{row.feature}</div>
                </div>
              </TableCell>
              <TableCell className="text-center group relative bg-success/10">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.allyship ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Allyship"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Does not follow Best Practice"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.wcag21a ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Compliant with WCAG 2.1 A"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Not compliant with WCAG 2.1 A"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.wcag21aa ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Compliant with WCAG 2.1 AA"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Not compliant with WCAG 2.1 AA"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.wcag22a ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Compliant with WCAG 2.2 A"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Not compliant with WCAG 2.2 A"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.wcag22aa ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Compliant with WCAG 2.2 AA"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Not compliant with WCAG 2.2 AA"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.section508 ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Compliant with Section 508"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Not compliant with Section 508"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.en301549 ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Compliant with EN 301 549"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Not compliant with EN 301 549"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center group relative">
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 -left-4 -right-4 -top-[${tableHeight}px] -bottom-[${tableHeight}px] bg-muted/50 opacity-0 group-hover:opacity-100 pointer-events-none`}
                  />
                  <span className="flex items-center justify-center">
                    {row.tags.bestPractice ? (
                      <Check
                        className="h-4 w-4 text-green-600"
                        aria-label="Follows Best Practice"
                      />
                    ) : (
                      <X
                        className="h-4 w-4 text-red-600"
                        aria-label="Does not follow Best Practice"
                      />
                    )}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
