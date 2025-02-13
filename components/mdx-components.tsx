import * as React from "react"
import { useId } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Code } from "@/components/code"

const MarkComponent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <span
    className={cn(
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 rounded-sm px-1 py-0.5 font-medium",
      className
    )}
  >
    {children}
  </span>
)

// add eslint ignore
/* eslint-disable @typescript-eslint/no-explicit-any */
export const components = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-2 scroll-m-20 text-4xl font-bold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 border-b border-border pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn(
        "mt-8 scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className={cn(
        "mt-8 scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className={cn(
        "mt-8 scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  ),
  a: ({
    className,
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http")
    const id = useId()

    return (
      <a
        className={cn(
          "font-medium underline underline-offset-4 inline-flex items-center gap-1",
          className
        )}
        href={href}
        {...props}
        {...(isExternal
          ? {
              target: "_blank",
              rel: "noopener noreferrer",
              "aria-labelledby": `${id}-link-label`,
            }
          : {})}
      >
        {children}
        {isExternal && (
          <>
            <ExternalLink aria-hidden="true" size={16} />
            <span id={`${id}-link-label`} className="sr-only">
              {children} (opens in new window)
            </span>
          </>
        )}
      </a>
    )
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={cn("my-6 ml-6 list-disc", className)} {...props} />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className={cn("my-6 ml-6 list-decimal", className)} {...props} />
  ),
  li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2", className)} {...props} />
  ),
  blockquote: ({
    className,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  img: ({
    className,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn("rounded-md border border-border", className)}
      alt={alt}
      {...props}
    />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8 bg-border border-b border-border" {...props} />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 -mr-8">
      <div className="w-full overflow-x-auto border border-border rounded-lg">
        <Table className={cn("w-full] ", className)} {...props} />
      </div>
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <TableHeader className={cn("bg-muted/50", className)} {...props} />
  ),
  tbody: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <TableBody className={cn(className)} {...props} />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <TableRow
      className={cn("border-b transition-colors hover:bg-muted/50", className)}
      {...props}
    />
  ),
  th: ({
    className,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <TableHead
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&[align=center]]:text-center [&[align=right]]:text-right w-fit min-w-min max-w-[300px] whitespace-normal",
        className
      )}
      {...props}
    />
  ),
  td: ({
    className,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <TableCell
      className={cn(
        "p-4 align-middle [&[align=center]]:text-center [&[align=right]]:text-right w-fit  min-w-min max-w-[300px] whitespace-normal",
        className
      )}
      {...props}
    />
  ),
  figure: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <figure
      className={cn("relative overflow-auto my-6 w-full", className)}
      {...props}
    />
  ),
  Image,
  Link,
  mark: MarkComponent,
  Code,
  strong: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => {
    // Check if the content is a number (for fines/amounts)
    const isAmount =
      typeof children === "string" &&
      /^[€$¥£]?\d+[,.]?\d*[MK]?\s*(CHF|EUR)?$/.test(children)

    return (
      <strong
        className={cn(
          "font-semibold",
          isAmount &&
            "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-sm px-1 py-0.5",
          className
        )}
        {...props}
      >
        {children}
      </strong>
    )
  },
}

interface MDXProps {
  source: string
}

export function MDXContent({ source }: MDXProps) {
  return (
    <div className="mdx max-w-none">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            format: "mdx",
          },
        }}
      />
    </div>
  )
}

export function useMDXComponents() {
  return components
}
