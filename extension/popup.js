document.addEventListener("DOMContentLoaded", () => {
  const openEditorButton = document.getElementById("openEditor")

  openEditorButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "activateEditor" },
        (response) => {
          if (response?.success) {
            window.close()
          }
        }
      )
    })
  })
})
