// playwright-test-skip-heading-levels.spec.ts
import { expect, test } from "@playwright/test"

test.describe("WCAG 1.3.1: Info and Relationships", () => {
  test("should not skip heading levels", async ({ page }) => {
    // Navigate to the target webpage
    await page.goto("/") // Replace with your target URL

    // Select all heading elements (h1 to h6)
    const headings = await page.$$eval("h1, h2, h3, h4, h5, h6", (elements) => {
      return elements.map((el) => ({
        tagName: el.tagName,
        text: el.textContent.trim(),
      }))
    })

    // Map heading levels to numbers (h1 -> 1, h2 -> 2, ...)
    const headingLevels = headings.map((h) => parseInt(h.tagName.slice(1), 10))

    // Check for skipped levels
    for (let i = 0; i < headingLevels.length - 1; i++) {
      const current = headingLevels[i]
      const next = headingLevels[i + 1]

      // Ensure the next level is not skipped
      expect(next).toBeLessThanOrEqual(current + 1)
    }

    console.log("All headings are properly nested:", headings)
  })

  test("should have only one h1 heading", async ({ page }) => {
    // Navigate to the target webpage
    await page.goto("/") // Replace with your target URL

    // Count the number of h1 headings
    const h1Count = await page.$$eval("h1", (elements) => elements.length)

    // Expect only one h1 heading
    expect(h1Count).toBe(1)

    console.log("There is only one h1 heading on the page.")
  })

  test("should have fieldsets with legend as the first child", async ({
    page,
  }) => {
    // Navigate to the target webpage
    await page.goto("/") // Replace with your target URL

    // Select all fieldsets
    const fieldsets = await page.$$eval("fieldset", (elements) => {
      return elements.map((el) => {
        const firstChild = el.firstElementChild
        return {
          hasLegend: firstChild?.tagName === "LEGEND",
          legendText:
            firstChild?.tagName === "LEGEND"
              ? firstChild.textContent.trim()
              : null,
        }
      })
    })

    // Verify each fieldset has a legend as the first child
    fieldsets.forEach((fieldset, index) => {
      expect(fieldset.hasLegend).toBe(true)
      console.log(`Fieldset ${index + 1} has a legend: ${fieldset.legendText}`)
    })

    console.log("All fieldsets have legends as their first child.")
  })

  test("should have tables with appropriate headers", async ({ page }) => {
    await page.goto("/") // Replace with your target URL

    const tables = await page.$$eval("table", (elements) =>
      elements.map((table) => {
        const headers = table.querySelectorAll("th")
        return {
          hasHeaders: headers.length > 0,
          hasScopeOrId: Array.from(headers).every(
            (th) => th.hasAttribute("scope") || th.id
          ),
        }
      })
    )

    tables.forEach((table, index) => {
      expect(table.hasHeaders).toBe(true)
      expect(table.hasScopeOrId).toBe(true)
      console.log(`Table ${index + 1} has appropriate headers.`)
    })

    console.log("All tables have appropriate headers.")
  })

  test("should have appropriate and unique landmark roles", async ({
    page,
  }) => {
    await page.goto("https://www.example.com") // Replace with your target URL

    const roles = await page.$$eval("[role]", (elements) =>
      elements.map((el) => el.getAttribute("role"))
    )

    const uniqueRoles = new Set(roles)

    roles.forEach((role, index) => {
      console.log(`Role ${index + 1}: ${role}`)
    })

    expect(roles.length).toBe(uniqueRoles.size) // Ensure roles are unique
    console.log("All landmark roles are appropriately and uniquely used.")
  })

  test("should have only one main landmark on the page", async ({ page }) => {
    // Navigate to the target webpage
    await page.goto("/") // Replace with your target URL

    // Select all main landmarks (either <main> tags or elements with role="main")
    const mainLandmarks = await page.$$eval(
      'main, [role="main"]',
      (elements) => elements.length
    )

    // Verify that there is only one main landmark
    expect(mainLandmarks).toBe(1)

    console.log(`There is only one main landmark on the page.`)
  })

  test("should have a label associated with every input element", async ({
    page,
  }) => {
    // Navigate to the target webpage
    await page.goto("/contact") // Replace with your target URL

    // Get all input elements
    const inputs = await page.$$eval("input", (elements) =>
      elements.map((el) => ({
        id: el.id,
        type: el.type,
        label: el.labels?.[0]?.innerText || null, // Associated label text
        ariaLabel: el.getAttribute("aria-label") || null,
      }))
    )

    // Check if each input has an associated label or aria-label
    inputs.forEach(({ id, type, label, ariaLabel }, index) => {
      const hasAccessibleLabel = !!label || !!ariaLabel
      expect(hasAccessibleLabel).toBe(true)

      if (!hasAccessibleLabel) {
        console.error(
          `Input element ${index + 1} (type: "${type}"${id ? `, id: "${id}"` : ""}) does not have an associated label or aria-label.`
        )
      }
    })

    console.log("All input elements have associated labels or aria-labels.")
  })
})
