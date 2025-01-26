"use client"

import { useState } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the dashboard
const websites = [
  { id: "1", name: "Example.com" },
  { id: "2", name: "Accessibility.org" },
  { id: "3", name: "Inclusive.net" },
]

const wcagErrorsData = [
  { date: "2023-01-01", errors: 15 },
  { date: "2023-02-01", errors: 12 },
  { date: "2023-03-01", errors: 8 },
  { date: "2023-04-01", errors: 10 },
  { date: "2023-05-01", errors: 6 },
  { date: "2023-06-01", errors: 4 },
]

const latestChecks = [
  { id: "1", date: "2023-06-01", errors: 4, status: "Improved" },
  { id: "2", date: "2023-05-15", errors: 5, status: "No Change" },
  { id: "3", date: "2023-05-01", errors: 6, status: "Improved" },
]

const pageWideErrors = [
  {
    id: "1",
    description: "Missing lang attribute on html element",
    impact: "High",
  },
  { id: "2", description: "Insufficient color contrast", impact: "Medium" },
  {
    id: "3",
    description: "Missing alternative text for images",
    impact: "High",
  },
]

const siteSpecificErrors = [
  { id: "1", page: "/home", description: "Empty link", impact: "Medium" },
  {
    id: "2",
    page: "/products",
    description: "Missing form labels",
    impact: "High",
  },
  {
    id: "3",
    page: "/contact",
    description: "Improper heading structure",
    impact: "Medium",
  },
]

export default function AccessibilityDashboard() {
  const [selectedWebsite, setSelectedWebsite] = useState(websites[0].id)

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Metrics Dashboard</CardTitle>
          <CardDescription>
            Track WCAG errors and improvements over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedWebsite}
            onValueChange={(value) => setSelectedWebsite(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {websites.map((website) => (
                <SelectItem key={website.id} value={website.id}>
                  {website.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WCAG Errors Over Time</CardTitle>
          <CardDescription>
            {websites.find((w) => w.id === selectedWebsite)?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              errors: {
                label: "WCAG Errors",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wcagErrorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="errors"
                  stroke="var(--color-errors)"
                  name="WCAG Errors"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestChecks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{check.date}</TableCell>
                  <TableCell>{check.errors}</TableCell>
                  <TableCell>{check.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Error Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="page-wide">
            <TabsList>
              <TabsTrigger value="page-wide">Page-Wide Errors</TabsTrigger>
              <TabsTrigger value="site-specific">
                Site-Specific Errors
              </TabsTrigger>
            </TabsList>
            <TabsContent value="page-wide">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageWideErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>{error.description}</TableCell>
                      <TableCell>{error.impact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="site-specific">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {siteSpecificErrors.map((error) => (
                    <TableRow key={error.id}>
                      <TableCell>{error.page}</TableCell>
                      <TableCell>{error.description}</TableCell>
                      <TableCell>{error.impact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
