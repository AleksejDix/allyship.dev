// Get button elements
const auditBtn = document.getElementById("run-audit")
const landmarksBtn = document.getElementById("show-landmarks")
const contrastBtn = document.getElementById("check-contrast")
const resultsContainer = document.querySelector(".results-container")

// Function to update results display
function updateResults(results) {
  resultsContainer.innerHTML = ""

  if (!results || results.length === 0) {
    resultsContainer.textContent = "No issues found."
    return
  }

  results.forEach((result) => {
    const resultItem = document.createElement("div")
    resultItem.className = "result-item"

    const resultHeader = document.createElement("div")
    resultHeader.className = "result-header"

    const title = document.createElement("span")
    title.className = "result-title"
    title.textContent = result.title

    const status = document.createElement("span")
    status.className = `result-status status-${result.type}`
    status.textContent = result.type

    resultHeader.appendChild(title)
    resultHeader.appendChild(status)

    const details = document.createElement("div")
    details.className = "result-details"
    details.textContent = result.details

    resultItem.appendChild(resultHeader)
    resultItem.appendChild(details)
    resultsContainer.appendChild(resultItem)
  })
}

// Function to send message to content script
async function sendMessageToActiveTab(action) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab) {
      throw new Error("No active tab found")
    }

    // First ensure content script is injected
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"],
    })

    // Then send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action })

    if (response.error) {
      throw new Error(response.error)
    }

    updateResults(response.results)
  } catch (error) {
    updateResults([
      {
        title: "Error",
        type: "error",
        details: error.message,
      },
    ])
  }
}

// Add click event listeners
auditBtn.addEventListener("click", () => {
  resultsContainer.textContent = "Running accessibility audit..."
  sendMessageToActiveTab("runAudit")
})

landmarksBtn.addEventListener("click", () => {
  resultsContainer.textContent = "Analyzing landmarks..."
  sendMessageToActiveTab("showLandmarks")
})

contrastBtn.addEventListener("click", () => {
  resultsContainer.textContent = "Checking color contrast..."
  sendMessageToActiveTab("checkContrast")
})
