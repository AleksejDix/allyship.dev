// Event Types
export type EventType =
  | "TOOL_STATE_CHANGE"
  | "HEADING_ANALYSIS_REQUEST"
  | "HEADING_ANALYSIS_COMPLETE"
  | "HEADING_ISSUE_FOUND"
  | "HEADING_HIGHLIGHT_REQUEST"
  | "HEADING_NAVIGATE_REQUEST"

// Base Event Interface
export interface BaseEvent {
  type: EventType
  timestamp: number
  tabId?: number
}

// Tool State Events
export interface ToolStateEvent extends BaseEvent {
  type: "TOOL_STATE_CHANGE"
  data: {
    tool: string
    enabled: boolean
  }
}

// Analysis Events
export interface HeadingAnalysisRequestEvent extends BaseEvent {
  type: "HEADING_ANALYSIS_REQUEST"
}

export interface HeadingAnalysisCompleteEvent extends BaseEvent {
  type: "HEADING_ANALYSIS_COMPLETE"
  data: {
    issues: HeadingIssue[]
    stats: {
      total: number
      invalid: number
    }
  }
}

// Issue Events
export interface HeadingIssue {
  id: string
  selector: string
  message: string
  severity: "Critical" | "High" | "Medium" | "Low"
  element?: {
    tagName: string
    textContent: string
    xpath: string
  }
}

export interface HeadingIssueFoundEvent extends BaseEvent {
  type: "HEADING_ISSUE_FOUND"
  data: {
    issue: HeadingIssue
  }
}

// UI Events
export interface HeadingHighlightRequestEvent extends BaseEvent {
  type: "HEADING_HIGHLIGHT_REQUEST"
  data: {
    selector: string
    message: string
    isValid: boolean
  }
}

export interface HeadingNavigateRequestEvent extends BaseEvent {
  type: "HEADING_NAVIGATE_REQUEST"
  data: {
    xpath: string
  }
}

// Union type of all events
export type AllyStudioEvent =
  | ToolStateEvent
  | HeadingAnalysisRequestEvent
  | HeadingAnalysisCompleteEvent
  | HeadingIssueFoundEvent
  | HeadingHighlightRequestEvent
  | HeadingNavigateRequestEvent

// Event handler type
export type EventHandler = (event: AllyStudioEvent) => void

// Event bus interface
export interface EventBus {
  subscribe: (handler: EventHandler) => () => void
  publish: (event: AllyStudioEvent) => void
}
