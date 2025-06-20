import { eventBus } from "@/lib/events/event-bus"
import { createElementOutliner } from "@allystudio/element-outliner"

// Create outliner instance
const outliner = createElementOutliner()

export function initialize(): void {
  eventBus.subscribe((event) => {
    if (event.type === "OUTLINER_COMMAND") {
      const { command } = event.data

      switch (command) {
        case "start":
          outliner.start()
          break
        case "stop":
          outliner.stop()
          break
        case "toggle":
          outliner.toggle()
          break
      }
    }
  })
}
