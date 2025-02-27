// Event Types
export type EventType =
  | "TOOL_STATE_CHANGE"
  | "HIGHLIGHT"
  | "HEADING_NAVIGATE_REQUEST"
  | "TESTS_COMPLETE"
  | "LAYER_TOGGLE_REQUEST"
  | "INSPECTOR_COMMAND"
  | "OUTLINER_COMMAND"
  | "FOCUS_ORDER_COMMAND"
  | "FOCUS_ORDER_STATS"
  | "CONTENT_SCRIPT_READY"
  | "DOM_CHANGE"
  | "TEST_ANALYSIS_REQUEST"
  | "TEST_ANALYSIS_COMPLETE"

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
    command:
      | "start"
      | "stop"
      | "toggleDebug"
      | "toggleDeepInspection"
      | "toggleClickThrough"
  }
}

// Outliner Events
export interface OutlinerCommandEvent extends BaseEvent {
  type: "OUTLINER_COMMAND"
  data: {
    command: "start" | "stop" | "toggle"
  }
}

// Focus Order Events
export interface FocusOrderCommandEvent extends BaseEvent {
  type: "FOCUS_ORDER_COMMAND"
  data: {
    command: "start" | "stop" | "toggle"
  }
}

export interface FocusOrderStatsEvent extends BaseEvent {
  type: "FOCUS_ORDER_STATS"
  data: {
    total: number
    positiveTabIndex: number
  }
}

// Content Script Events
export interface ContentScriptReadyEvent extends BaseEvent {
  type: "CONTENT_SCRIPT_READY"
  data: {
    features: string[]
  }
}

// DOM Change Events
export interface DOMChangeEvent extends BaseEvent {
  type: "DOM_CHANGE"
  data: {
    elements: {
      selector: string
      tagName: string
      textContent?: string
      xpath?: string
    }[]
    changeType: "added" | "removed" | "attribute" | "text"
    timestamp: number
  }
}

// Generic test events for all test types
export interface TestAnalysisRequestEvent extends BaseEvent {
  type: "TEST_ANALYSIS_REQUEST"
  data: {
    testId: string // e.g. "headings", "links", etc.
  }
}

export interface TestAnalysisCompleteEvent extends BaseEvent {
  type: "TEST_ANALYSIS_COMPLETE"
  data: {
    testId: string
    issues: any[]
    stats: {
      total: number
      invalid: number
    }
  }
}

// Type definitions for test issues
// These remain because they define the shape of issues returned in the TEST_ANALYSIS_COMPLETE event
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

// Union type of all events
export type AllyStudioEvent =
  | ToolStateEvent
  | HeadingHighlightRequestEvent
  | HeadingNavigateRequestEvent
  | TestsCompleteEvent
  | LayerToggleRequestEvent
  | InspectorCommandEvent
  | OutlinerCommandEvent
  | FocusOrderCommandEvent
  | FocusOrderStatsEvent
  | ContentScriptReadyEvent
  | DOMChangeEvent
  | TestAnalysisRequestEvent
  | TestAnalysisCompleteEvent

// Event handler type
export type EventHandler = (event: AllyStudioEvent) => void

// Event bus interface
export interface EventBus {
  subscribe: (handler: EventHandler) => () => void
  publish: (event: AllyStudioEvent) => void
}
