// import { expect, test } from "@playwright/test"

// test("WCAG 1.1.4: Ensure text is readable and functionality remains at 200% zoom", async ({
//   page,
// }) => {
//   // Navigate to the page
//   await page.goto("/") // Replace with your URL

//   // Set the viewport to simulate 200% zoom
//   await page.setViewportSize({
//     width: 1920 / 2, // Divide by 2 to simulate 200% zoom
//     height: 1080 / 2,
//   })

//   // Ensure key text elements are visible and not clipped
//   const textElements = await page.$$("*:not(:empty)") // All non-empty elements

//   for (const element of textElements) {
//     const isVisible = await element.isVisible()
//     if (!isVisible) {
//       const outerHTML = await element.evaluate((el) => el.outerHTML) // Log the outer HTML
//       console.log(`Element not visible: ${outerHTML}`)
//     }
//     expect(isVisible).toBeTruthy()

//     // Check if the element is clipped
//     const boundingBox = await element.boundingBox()
//     if (!boundingBox || boundingBox.width <= 0 || boundingBox.height <= 0) {
//       const outerHTML = await element.evaluate((el) => el.outerHTML) // Log the outer HTML
//       console.log(`Element is clipped or has no size: ${outerHTML}`)
//     }
//     expect(boundingBox).not.toBeNull()
//     expect(boundingBox!.width).toBeGreaterThan(0)
//     expect(boundingBox!.height).toBeGreaterThan(0)
//   }

//   console.log("All text elements remain visible and functional at 200% zoom.")
// })
