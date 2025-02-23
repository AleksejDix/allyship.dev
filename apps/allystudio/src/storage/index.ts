import { Storage } from "@plasmohq/storage"

export const storage = new Storage()

storage.watch({
  test_enabled_headings: ({ newValue }) => {
    console.log("test", newValue)
  },
  heading_issues: ({ newValue }) => {
    console.table(newValue)
  }
})
