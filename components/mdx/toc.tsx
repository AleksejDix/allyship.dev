"use client"

import type { FC, JSX, PropsWithChildren, ReactNode } from "react"
import { Children, cloneElement, isValidElement } from "react"

import { cn } from "@/lib/utils"

import useIntersectionObserver from "./useIntersectionObserver"

interface IntersectionObserverProps {
  headingsToObserve?: string
  rootMargin?: string
  threshold?: number
}

export type TocHighlightProps = PropsWithChildren<IntersectionObserverProps>

interface ChildProps extends PropsWithChildren {
  className?: string
  href: string
  children: ReactNode
}

type ValidAnchorElement = ReactNode & ChildProps

export const TocHighlight: FC<TocHighlightProps> = (props): JSX.Element => {
  const { headingsToObserve, rootMargin, threshold, ...rest } = props

  const tocHeadingsToObserve = headingsToObserve ?? "h1, h2, h3"
  const tocRootMargin = rootMargin ?? "-10% 0px -40% 0px"
  const tocThreshold = threshold ?? 0.2

  const children = Children.toArray(props.children)

  function recursiveChildren(
    children: ReactNode[],
    activeIdState: string
  ): ReactNode {
    const newChildren = Children.map(children, (child) => {
      let clonedChild: ReactNode = child

      if (isValidElement<ValidAnchorElement>(child)) {
        const children = Children.toArray(child.props.children)

        clonedChild = cloneElement(child, {
          children: recursiveChildren(children, activeIdState),
        })

        if ("href" in child.props) {
          const childProps = child.props
          const hrefId = childProps.href.substring(1)

          if (hrefId === activeIdState) {
            clonedChild = cloneElement(child, {
              className: cn(
                childProps.className,
                "text-primary font-medium border-l-2 border-primary pl-2 -ml-2"
              ),
            })
          }
        }
      }

      return clonedChild
    })

    return newChildren
  }

  const { activeIdState } = useIntersectionObserver(
    tocHeadingsToObserve,
    tocRootMargin,
    tocThreshold
  )

  return (
    <>
      <aside {...rest}>{recursiveChildren(children, activeIdState)}</aside>
    </>
  )
}
