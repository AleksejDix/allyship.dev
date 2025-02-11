document.addEventListener("DOMContentLoaded", () => {
  const openEditorButton = document.getElementById("openEditor")

  openEditorButton.addEventListener("click", async () => {
    try {
      // Get the current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })

      // Check if we can access the tab
      if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("edge://")) {
        console.log("Sending initializeOverlay message to tab:", tab.id)

        // Send message to initialize overlay
        const response = await chrome.tabs
          .sendMessage(tab.id, {
            action: "initializeOverlay",
          })
          .catch((error) => {
            console.error("Failed to send message:", error)
            throw error
          })

        console.log("Response received:", response)

        if (response?.success) {
          // Close the popup only if initialization was successful
          window.close()
        } else {
          console.error("Failed to initialize overlay:", response?.error)
        }
      }
    } catch (error) {
      console.error("Failed to initialize overlay:", error)
      // You might want to show an error message to the user here
    }
  })
})
