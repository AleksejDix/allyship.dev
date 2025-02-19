"use client"

import { useEffect, useRef } from "react"
import { CustomPreProps, InnerPre } from "codehike/code"
import {
  calculateTransitions,
  getStartingSnapshot,
  TokenTransitionsSnapshot,
} from "codehike/utils/token-transitions"

const MAX_TRANSITION_DURATION = 900 // milliseconds

interface Keyframe {
  [property: string]: string | number | null | undefined
  offset?: number | null
}

export function PreWithRef(props: CustomPreProps) {
  const ref = useRef<HTMLPreElement | null>(null)
  const prevSnapshotRef = useRef<TokenTransitionsSnapshot | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const snapshot = prevSnapshotRef.current
    if (snapshot) {
      const transitions = calculateTransitions(ref.current, snapshot)
      transitions.forEach(({ element, keyframes, options }) => {
        const { translateX, translateY } = keyframes as {
          translateX?: [number, number]
          translateY?: [number, number]
        }
        const keyframeEffect: Keyframe[] = []

        if (translateX && translateY) {
          keyframeEffect.push(
            {
              translate: `${translateX[0]}px ${translateY[0]}px`,
              offset: 0,
            },
            {
              translate: `${translateX[1]}px ${translateY[1]}px`,
              offset: 1,
            }
          )
        }

        element.animate(keyframeEffect, {
          duration: options.duration * MAX_TRANSITION_DURATION,
          delay: options.delay * MAX_TRANSITION_DURATION,
          easing: options.easing,
          fill: "both",
        })
      })
    }

    prevSnapshotRef.current = getStartingSnapshot(ref.current)
  })

  return <InnerPre ref={ref} merge={props} style={{ position: "relative" }} />
}
