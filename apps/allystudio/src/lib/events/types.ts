// Event Types
export type EventType =
  | "TOOL_STATE_CHANGE"
  | "HEADING_ANALYSIS_REQUEST"
  | "HEADING_ANALYSIS_COMPLETE"
  | "HEADING_ISSUE_FOUND"
  | "HIGHLIGHT"
  | "HEADING_NAVIGATE_REQUEST"
  | "LINK_ANALYSIS_REQUEST"
  | "LINK_ANALYSIS_COMPLETE"
  | "LINK_HIGHLIGHT_REQUEST"
  | "ALT_ANALYSIS_REQUEST"
  | "ALT_ANALYSIS_COMPLETE"
  | "INTERACTIVE_ANALYSIS_REQUEST"
  | "INTERACTIVE_ANALYSIS_COMPLETE"
  | "TESTS_COMPLETE"
  | "LAYER_TOGGLE_REQUEST"
  | "INSPECTOR_COMMAND"
  | "CONTENT_SCRIPT_READY"

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
export interface HighlightRequestData {
  selector: string
  message: string
  isValid: boolean
  clear?: boolean
  layer?: string
}

export interface HeadingHighlightRequestEvent extends BaseEvent {
  type: "HIGHLIGHT"
  data: HighlightRequestData
}

export interface HeadingNavigateRequestEvent extends BaseEvent {
  type: "HEADING_NAVIGATE_REQUEST"
  data: {
    xpath: string
  }
}

// Link Events
export interface LinkAnalysisRequestEvent extends BaseEvent {
  type: "LINK_ANALYSIS_REQUEST"
}

export interface LinkAnalysisCompleteEvent extends BaseEvent {
  type: "LINK_ANALYSIS_COMPLETE"
  data: {
    issues: LinkIssue[]
    stats: {
      total: number
      invalid: number
    }
  }
}

export interface LinkIssue {
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

export interface LinkHighlightRequestEvent extends BaseEvent {
  type: "LINK_HIGHLIGHT_REQUEST"
  data: {
    selector: string
    message: string
    isValid: boolean
  }
}

// Alt Text Events
export interface AltAnalysisRequestEvent extends BaseEvent {
  type: "ALT_ANALYSIS_REQUEST"
}

export interface AltAnalysisCompleteEvent extends BaseEvent {
  type: "ALT_ANALYSIS_COMPLETE"
  data: {
    issues: AltIssue[]
    stats: {
      total: number
      invalid: number
    }
  }
}

export interface AltIssue {
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

// Interactive Analysis Events
export interface InteractiveAnalysisRequestEvent extends BaseEvent {
  type: "INTERACTIVE_ANALYSIS_REQUEST"
}

export interface InteractiveAnalysisCompleteEvent extends BaseEvent {
  type: "INTERACTIVE_ANALYSIS_COMPLETE"
  data: {
    issues: InteractiveIssue[]
    stats: {
      total: number
      invalid: number
    }
  }
}

export interface InteractiveIssue {
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

export interface TestsCompleteEvent extends BaseEvent {
  type: "TESTS_COMPLETE"
}

export interface LayerToggleRequestEvent extends BaseEvent {
  type: "LAYER_TOGGLE_REQUEST"
  data: {
    layer: string
    visible?: boolean // if not provided, will toggle current state
  }
}

// Inspector Events
export interface InspectorCommandEvent extends BaseEvent {
  type: "INSPECTOR_COMMAND"
  data: {
    command: "start" | "stop"
  }
}

// Content Script Events
export interface ContentScriptReadyEvent extends BaseEvent {
  type: "CONTENT_SCRIPT_READY"
  data: {
    features: string[]
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
  | LinkAnalysisRequestEvent
  | LinkAnalysisCompleteEvent
  | LinkHighlightRequestEvent
  | AltAnalysisRequestEvent
  | AltAnalysisCompleteEvent
  | InteractiveAnalysisRequestEvent
  | InteractiveAnalysisCompleteEvent
  | TestsCompleteEvent
  | LayerToggleRequestEvent
  | InspectorCommandEvent
  | ContentScriptReadyEvent

// Event handler type
export type EventHandler = (event: AllyStudioEvent) => void

// Event bus interface
export interface EventBus {
  subscribe: (handler: EventHandler) => () => void
  publish: (event: AllyStudioEvent) => void
}
