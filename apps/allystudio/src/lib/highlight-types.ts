export interface HighlightStyles {
  border: string
  background: string
  messageBackground: string
}

export interface HighlightData {
  selector: string
  message: string
  element: HTMLElement
  isValid: boolean
  styles?: HighlightStyles
  layer: string
}

export interface HighlightEvent {
  selector: string
  message: string
  isValid: boolean
  clear?: boolean
  layer: string
}

export const DEFAULT_HIGHLIGHT_STYLES = {
  valid: {
    border: "#16A34A",
    background: "rgba(22, 163, 74, 0.1)",
    messageBackground: "#16A34A"
  },
  invalid: {
    border: "#DC2626",
    background: "rgba(220, 38, 38, 0.1)",
    messageBackground: "#DC2626"
  }
} as const
