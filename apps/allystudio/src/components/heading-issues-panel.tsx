import { useEffect, useState } from "react"

interface IssueLocation {
  xpath: string
  selector: string
  element_type: string
  context: string
}

interface PanelIssue {
  id: string
  severity: "Critical" | "High" | "Medium" | "Low"
  message: string
  element: string
  expected: string
  location: IssueLocation
  text: string
}

export function HeadingIssuesPanel() {
  const [issues, setIssues] = useState<PanelIssue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Listen for messages from content script
    const handleMessage = (message: any) => {
      console.log("Received message in sidepanel:", message)
      if (message.type === "HEADING_ISSUES_UPDATE") {
        console.log("Updating issues:", message.issues)
        setIssues(message.issues)
      }
    }

    // Add message listener
    chrome.runtime.onMessage.addListener(handleMessage)

    // Request current issues from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: "REQUEST_HEADING_ISSUES"
        })
      }
    })

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  const handleIssueClick = (issue: PanelIssue) => {
    setSelectedIssue(issue.id)
    // Send message to content script to highlight the element
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: "NAVIGATE_TO_HEADING_ISSUE",
          xpath: issue.location.xpath
        })
      }
    })
  }

  const getSeverityIcon = (severity: PanelIssue["severity"]) => {
    switch (severity) {
      case "Critical":
        return "⛔️"
      case "High":
        return "⚠️"
      case "Medium":
        return "⚡️"
      case "Low":
        return "ℹ️"
      default:
        return "ℹ️"
    }
  }

  const getSeverityClass = (severity: PanelIssue["severity"]) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 dark:text-red-400"
      case "High":
        return "text-orange-600 dark:text-orange-400"
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "Low":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  if (issues.length === 0) {
    return (
      <div className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
        No issues found
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
        <span className="transform transition-transform duration-200 ease-in-out">
          {isExpanded ? "▼" : "▶"}
        </span>
        <span>Heading Issues ({issues.length})</span>
      </button>
      {isExpanded && (
        <div className="space-y-0.5 pl-4">
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => handleIssueClick(issue)}
              className={`group flex w-full items-start gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedIssue === issue.id ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}>
              <span
                className={`flex h-4 w-4 items-center justify-center ${getSeverityClass(
                  issue.severity
                )}`}>
                {getSeverityIcon(issue.severity)}
              </span>
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {issue.element} → {issue.expected}
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {issue.message}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
