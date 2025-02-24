import { Storage } from "@plasmohq/storage"

import "./layers" // Import layers script to execute it

import { setupAuthHandlers } from "./handlers/auth"
import { setupMessageHandlers } from "./handlers/messages"
import { setupTabHandlers } from "./handlers/tabs"
import { rootActor } from "./machines/root"

// Initialize storage
export const storage = new Storage()

// Configure sidebar to open on action click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Failed to set panel behavior:", error))

// Start the root actor
rootActor.start()

// Setup all handlers
setupMessageHandlers()
setupTabHandlers()
setupAuthHandlers()
