import { ToolResult } from "./base-tool"

let isActive = false
const originalStyles = new WeakMap<
  HTMLElement,
  {
    outline: string
    backgroundColor: string
  }
>()

function applyFormLabelsCheck() {
  const inputs = document.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]), select, textarea'
  )
  let issues: string[] = []

  inputs.forEach((input) => {
    const hasLabel =
      input instanceof HTMLElement &&
      input.id &&
      document.querySelector(`label[for="${input.id}"]`)
    const isLabelChild = input.closest("label")
    const isValid = hasLabel || isLabelChild

    originalStyles.set(input, {
      outline: input.style.outline || "",
      backgroundColor: input.style.backgroundColor || "",
    })

    input.style.outline = isValid ? "3px solid green" : "3px solid red"
    input.style.backgroundColor = isValid
      ? "rgba(0,255,0,0.1)"
      : "rgba(255,0,0,0.1)"

    if (!isValid) {
      issues.push(
        `Missing label for ${input.tagName.toLowerCase()}${
          input.id ? " with id " + input.id : ""
        }`
      )
    }
  })

  if (issues.length > 0) {
    console.warn("Form Label Issues:", issues)
  }
}

function cleanupFormLabelsCheck() {
  const inputs = document.querySelectorAll<HTMLElement>(
    'input:not([type="hidden"]), select, textarea'
  )
  inputs.forEach((input) => {
    const styles = originalStyles.get(input)
    if (styles) {
      input.style.outline = styles.outline
      input.style.backgroundColor = styles.backgroundColor
    }
  })
}

export function checkFormLabels(
  mode: "apply" | "cleanup" = "apply"
): ToolResult {
  if (mode === "cleanup") {
    cleanupFormLabelsCheck()
    isActive = false
    console.log("Form labels check disabled")
    return { success: true }
  } else {
    applyFormLabelsCheck()
    isActive = true
    console.log("Form labels check enabled")
    return { success: true }
  }
}
