"use client"

import { Square, SquareCheckBig } from "lucide-react"

import { TreeDataItem, TreeView } from "@/components/ui/tree-view"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

const data: TreeDataItem[] = [
  {
    id: "/",
    name: "/",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },
  {
    id: "/about",
    name: "/about",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },
  {
    id: "/contact",
    name: "/contact",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },
  {
    id: "/blog",
    name: "/blog",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },

  {
    id: "/blog/2024-01-21-click-target-size",
    name: "/blog/2024-01-21-click-target-size",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },
  {
    id: "/2024-01-20-why-capitalisation-matters-for-accessibility",
    name: "/2024-01-20-why-capitalisation-matters-for-accessibility",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },

  {
    id: "/privacy",
    name: "/privacy",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },
  {
    id: "/terms",
    name: "/terms",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },
  {
    id: "/imprint",
    name: "/imprint",
    icon: Square,
    selectedIcon: SquareCheckBig,
  },
]
export const SitemapCrawling = () => (
  <Card>
    <CardHeader>
      <CardTitle>
        <h2>Automatic Sitemap Crawling</h2>
      </CardTitle>
      <CardDescription>
        This is the sitemap that search engines will crawl.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <TreeView data={data} />
    </CardContent>
    <CardFooter className="block">
      <p className="text-sm">
        <strong>Tip:</strong> Make sure to include all important pages in your
        sitemap.
      </p>
      <p className="text-sm">
        <strong>Note:</strong> This sitemap is automatically generated. You can
        also manually add pages to your sitemap.
      </p>
    </CardFooter>
  </Card>
)
