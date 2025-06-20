/**
 * Accessibility utilities for DOM elements
 * Provides functions to analyze accessibility properties and roles
 */

/**
 * Get element's accessibility information
 */
export function getAccessibilityInfo(element: HTMLElement): {
  role: string | null
  ariaLabel: string | null
  ariaLabelledBy: string | null
  ariaDescribedBy: string | null
  tabIndex: number
  focusable: boolean
  accessibleName: string | null
  accessibleDescription: string | null
} {
  const computedRole = element.getAttribute('role') || getImplicitRole(element)

  return {
    role: computedRole,
    ariaLabel: element.getAttribute('aria-label'),
    ariaLabelledBy: element.getAttribute('aria-labelledby'),
    ariaDescribedBy: element.getAttribute('aria-describedby'),
    tabIndex: element.tabIndex,
    focusable: isFocusable(element),
    accessibleName: getAccessibleName(element),
    accessibleDescription: getAccessibleDescription(element)
  }
}

/**
 * Get implicit ARIA role for an element
 */
export function getImplicitRole(element: HTMLElement): string | null {
  const tagName = element.tagName.toLowerCase()

  // Handle input elements specially
  if (tagName === 'input') {
    return getInputRole(element as HTMLInputElement)
  }

  const roleMap: Record<string, string | null> = {
    'button': 'button',
    'a': element.hasAttribute('href') ? 'link' : null,
    'img': 'img',
    'h1': 'heading',
    'h2': 'heading',
    'h3': 'heading',
    'h4': 'heading',
    'h5': 'heading',
    'h6': 'heading',
    'nav': 'navigation',
    'main': 'main',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'header': 'banner',
    'section': 'region',
    'article': 'article',
    'form': 'form',
    'table': 'table',
    'ul': 'list',
    'ol': 'list',
    'li': 'listitem',
    'select': 'combobox',
    'textarea': 'textbox'
  }

  return roleMap[tagName] || null
}

/**
 * Get role for input elements based on type
 */
export function getInputRole(input: HTMLInputElement): string {
  const type = input.type.toLowerCase()

  const inputRoleMap: Record<string, string> = {
    'button': 'button',
    'submit': 'button',
    'reset': 'button',
    'checkbox': 'checkbox',
    'radio': 'radio',
    'range': 'slider',
    'search': 'searchbox',
    'email': 'textbox',
    'url': 'textbox',
    'tel': 'textbox',
    'password': 'textbox',
    'text': 'textbox',
    'number': 'spinbutton'
  }

  return inputRoleMap[type] || 'textbox'
}

/**
 * Check if element is focusable using modern approach
 * This is a simplified version - for production use, consider using
 * a more comprehensive library like focus-trap/tabbable
 */
export function isFocusable(element: HTMLElement): boolean {
  // Check if element has explicit tabindex
  if (element.hasAttribute('tabindex')) {
    const tabIndex = parseInt(element.getAttribute('tabindex') || '0', 10)
    return tabIndex >= 0
  }

  // Check if element is naturally focusable
  const tagName = element.tagName.toLowerCase()

  // Disabled elements are not focusable
  if ('disabled' in element && (element as any).disabled) {
    return false
  }

  // Inert elements are not focusable
  if (element.hasAttribute('inert') || element.closest('[inert]')) {
    return false
  }

  // Check naturally focusable elements
  switch (tagName) {
    case 'button':
    case 'select':
    case 'textarea':
      return true
    case 'input':
      return (element as HTMLInputElement).type !== 'hidden'
    case 'a':
    case 'area':
      return element.hasAttribute('href')
    case 'iframe':
      return true
    case 'audio':
    case 'video':
      return element.hasAttribute('controls')
    default:
      return element.hasAttribute('contenteditable') &&
             element.getAttribute('contenteditable') !== 'false'
  }
}

/**
 * Get the accessible name for an element
 * This is a simplified implementation of the accessible name calculation
 */
export function getAccessibleName(element: HTMLElement): string | null {
  // 1. aria-labelledby (highest priority)
  const labelledBy = element.getAttribute('aria-labelledby')
  if (labelledBy) {
    const labels = labelledBy.split(' ')
      .map(id => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean)
    if (labels.length > 0) {
      return labels.join(' ')
    }
  }

  // 2. aria-label
  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel?.trim()) {
    return ariaLabel.trim()
  }

  // 3. Associated label elements (for form controls)
  if (['input', 'select', 'textarea'].includes(element.tagName.toLowerCase())) {
    // Label with for attribute
    const id = element.id
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`)
      if (label?.textContent?.trim()) {
        return label.textContent.trim()
      }
    }

    // Label wrapping the element
    const wrappingLabel = element.closest('label')
    if (wrappingLabel?.textContent?.trim()) {
      return wrappingLabel.textContent.trim()
    }
  }

  // 4. alt attribute (for images)
  if (element.tagName.toLowerCase() === 'img') {
    const alt = element.getAttribute('alt')
    if (alt !== null) {
      return alt.trim() || null
    }
  }

  // 5. Element's text content (for many elements)
  const textContent = element.textContent?.trim()
  if (textContent) {
    return textContent
  }

  return null
}

/**
 * Get the accessible description for an element
 */
export function getAccessibleDescription(element: HTMLElement): string | null {
  // aria-describedby
  const describedBy = element.getAttribute('aria-describedby')
  if (describedBy) {
    const descriptions = describedBy.split(' ')
      .map(id => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean)
    if (descriptions.length > 0) {
      return descriptions.join(' ')
    }
  }

  // title attribute as fallback
  const title = element.getAttribute('title')
  if (title?.trim()) {
    return title.trim()
  }

  return null
}
