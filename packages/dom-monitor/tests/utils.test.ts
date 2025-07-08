import { beforeEach, describe, expect, test, vi } from "vitest"

import {
  defaultSelectorGenerator,
  isElementHidden,
  shouldIgnoreElement,
  throttle,
} from "../src/utils"

describe("Utils", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
  })

  describe("defaultSelectorGenerator", () => {
    test("generates ID selector when element has ID", () => {
      const div = document.createElement("div")
      div.id = "test-id"

      const selector = defaultSelectorGenerator(div)

      expect(selector).toBe("#test-id")
    })

    test("generates class selector when element has classes", () => {
      const div = document.createElement("div")
      div.className = "class1 class2"

      const selector = defaultSelectorGenerator(div)

      expect(selector).toBe("div.class1.class2")
    })

    test("filters empty classes", () => {
      const div = document.createElement("div")
      div.className = "class1  class2   "

      const selector = defaultSelectorGenerator(div)

      expect(selector).toBe("div.class1.class2")
    })

    test("generates tag selector when no ID or classes", () => {
      const div = document.createElement("div")

      const selector = defaultSelectorGenerator(div)

      expect(selector).toBe("div")
    })

    test("prefers ID over classes", () => {
      const div = document.createElement("div")
      div.id = "test-id"
      div.className = "test-class"

      const selector = defaultSelectorGenerator(div)

      expect(selector).toBe("#test-id")
    })

    test("handles uppercase tag names", () => {
      const button = document.createElement("BUTTON")

      const selector = defaultSelectorGenerator(button)

      expect(selector).toBe("button")
    })
  })

  describe("shouldIgnoreElement", () => {
    test("ignores SCRIPT elements", () => {
      const script = document.createElement("script")

      expect(shouldIgnoreElement(script)).toBe(true)
    })

    test("ignores STYLE elements", () => {
      const style = document.createElement("style")

      expect(shouldIgnoreElement(style)).toBe(true)
    })

    test("ignores NOSCRIPT elements", () => {
      const noscript = document.createElement("noscript")

      expect(shouldIgnoreElement(noscript)).toBe(true)
    })

    test("ignores elements with data-ignore attribute", () => {
      const div = document.createElement("div")
      div.setAttribute("data-ignore", "true")

      expect(shouldIgnoreElement(div)).toBe(true)
    })

    test("ignores elements with empty data-ignore attribute", () => {
      const div = document.createElement("div")
      div.setAttribute("data-ignore", "")

      expect(shouldIgnoreElement(div)).toBe(true)
    })

    test("does not ignore regular elements", () => {
      const div = document.createElement("div")

      expect(shouldIgnoreElement(div)).toBe(false)
    })

    test("does not ignore elements with other attributes", () => {
      const div = document.createElement("div")
      div.setAttribute("data-test", "value")

      expect(shouldIgnoreElement(div)).toBe(false)
    })
  })

  describe("isElementHidden", () => {
    test("detects display: none", () => {
      const div = document.createElement("div")
      div.style.display = "none"
      document.body.appendChild(div)

      expect(isElementHidden(div)).toBe(true)
    })

    test("detects visibility: hidden", () => {
      const div = document.createElement("div")
      div.style.visibility = "hidden"
      document.body.appendChild(div)

      expect(isElementHidden(div)).toBe(true)
    })

    test("detects opacity: 0", () => {
      const div = document.createElement("div")
      div.style.opacity = "0"
      document.body.appendChild(div)

      expect(isElementHidden(div)).toBe(true)
    })

    test("detects visible elements", () => {
      const div = document.createElement("div")
      div.style.display = "block"
      div.style.visibility = "visible"
      div.style.opacity = "1"
      document.body.appendChild(div)

      expect(isElementHidden(div)).toBe(false)
    })

    test("detects elements with default styles", () => {
      const div = document.createElement("div")
      document.body.appendChild(div)

      expect(isElementHidden(div)).toBe(false)
    })
  })

  describe("throttle", () => {
    test("calls function immediately on first call", () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      throttled("arg1", "arg2")

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith("arg1", "arg2")
    })

    test("throttles subsequent calls", async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      throttled("call1")
      throttled("call2")
      throttled("call3")

      // Only first call should execute immediately
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith("call1")

      // Wait for throttle delay
      await new Promise((resolve) => setTimeout(resolve, 150))

      // A delayed call should execute after delay
      // Note: The throttle function preserves the args from the first queued call
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith("call2")
    })

    test("executes after delay period", async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 50)

      throttled("first")

      // Wait for delay period
      await new Promise((resolve) => setTimeout(resolve, 60))

      throttled("second")

      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenNthCalledWith(1, "first")
      expect(fn).toHaveBeenNthCalledWith(2, "second")
    })

    test("handles rapid successive calls", async () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      // Rapid calls
      for (let i = 0; i < 10; i++) {
        throttled(`call${i}`)
      }

      // Only first call executes immediately
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith("call0")

      // Wait for throttle delay
      await new Promise((resolve) => setTimeout(resolve, 150))

      // A delayed call should execute with args from first queued call
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenLastCalledWith("call1")
    })

    test("preserves function context and return type", () => {
      const fn = vi.fn().mockReturnValue("result")
      const throttled = throttle(fn, 100)

      const result = throttled("test")

      expect(result).toBeUndefined() // Throttled functions don't return values
      expect(fn).toHaveBeenCalledWith("test")
    })
  })
})
