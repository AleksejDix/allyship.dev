let isActive = false
const originalStyles = new WeakMap<
  HTMLElement,
  {
    outline: string
  }
>()

function applyContrastCheck() {
  function getLuminance(r: number, g: number, b: number) {
    const [rs, gs, bs] = [r, g, b].map((v) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  function getContrastRatio(l1: number, l2: number) {
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  const textElements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, span, a"
  )

  textElements.forEach((el) => {
    const style = window.getComputedStyle(el)
    const bgColor = style.backgroundColor.match(/\d+/g)?.map(Number) || [
      255, 255, 255,
    ]
    const textColor = style.color.match(/\d+/g)?.map(Number) || [0, 0, 0]

    const bgLuminance = getLuminance(bgColor[0], bgColor[1], bgColor[2])
    const textLuminance = getLuminance(textColor[0], textColor[1], textColor[2])
    const ratio = getContrastRatio(bgLuminance, textLuminance)

    originalStyles.set(el, {
      outline: el.style.outline || "",
    })

    el.style.outline = ratio >= 4.5 ? "3px solid green" : "3px solid red"
    el.setAttribute("data-contrast-ratio", ratio.toFixed(2))
  })
}

function cleanupContrastCheck() {
  const elements = document.querySelectorAll<HTMLElement>(
    "p, h1, h2, h3, h4, h5, h6, span, a"
  )
  elements.forEach((element) => {
    const styles = originalStyles.get(element)
    if (styles) {
      element.style.outline = styles.outline
      element.removeAttribute("data-contrast-ratio")
    }
  })
}

export function checkColorContrast() {
  if (isActive) {
    cleanupContrastCheck()
    isActive = false
    console.log("Contrast check disabled")
  } else {
    applyContrastCheck()
    isActive = true
    console.log("Contrast check enabled")
  }
}
