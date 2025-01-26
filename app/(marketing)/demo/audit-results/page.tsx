"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

type Severity = "critical" | "serious" | "moderate" | "minor"
type Status = "pass" | "fail" | "warning"

interface AuditItem {
  id: string
  title: string
  description: string
  wcag: string
  severity: Severity
  status: Status
  impact: string
  recommendation: string
}

const auditResults = {
  score: 84,
  total: {
    pass: 47,
    fail: 8,
    warning: 12
  },
  categories: {
    perceivable: 92,
    operable: 88,
    understandable: 76,
    robust: 80
  },
  items: [
    {
      id: "1.1.1",
      title: "Images lack alternative text",
      description: "Several images on the page are missing alt text, making them inaccessible to screen readers.",
      wcag: "1.1.1 Non-text Content",
      severity: "serious",
      status: "fail",
      impact: "Screen reader users cannot understand the content of images",
      recommendation: "Add descriptive alt text to all images that convey information"
    },
    {
      id: "1.4.3",
      title: "Insufficient color contrast",
      description: "The gray text (#767676) on white background doesn't meet WCAG AA contrast requirements.",
      wcag: "1.4.3 Contrast (Minimum)",
      severity: "moderate",
      status: "warning",
      impact: "Users with low vision may have difficulty reading the text",
      recommendation: "Increase the contrast ratio to at least 4.5:1 for normal text"
    }
  ] as AuditItem[]
}

const severityColors: Record<Severity, string> = {
  critical: "text-red-500",
  serious: "text-orange-500",
  moderate: "text-yellow-500",
  minor: "text-blue-500"
}

const statusIcons: Record<Status, any> = {
  pass: CheckCircle,
  fail: XCircle,
  warning: AlertTriangle
}

const statusColors: Record<Status, string> = {
  pass: "text-green-500",
  fail: "text-red-500",
  warning: "text-yellow-500"
}

export default function AuditResultsDemo() {

  return (
    <div className="container py-8">
      {/* Overview Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Accessibility Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-6xl font-bold">{auditResults.score}</div>
              <div className="text-2xl text-muted-foreground mb-1">/100</div>
            </div>
            <Progress value={auditResults.score} className="mt-4" />
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{auditResults.total.pass}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{auditResults.total.fail}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{auditResults.total.warning}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WCAG Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(auditResults.categories).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Audit Findings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Issues</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="serious">Serious</TabsTrigger>
              <TabsTrigger value="moderate">Moderate</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {auditResults.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {React.createElement(statusIcons[item.status], {
                            className: `h-5 w-5 ${statusColors[item.status]}`
                          })}
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge variant="outline">{item.wcag}</Badge>
                          <Badge className={severityColors[item.severity]}>
                            {item.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {item.description}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Impact</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.impact}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Recommendation</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.recommendation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <Button className="w-full" size="lg">
              Download Full Report
            </Button>
            <Button className="w-full" variant="outline" size="lg">
              Schedule Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
