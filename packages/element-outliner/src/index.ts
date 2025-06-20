/**
 * @allystudio/element-outliner
 *
 * A modern CSS-based element outliner for web development debugging,
 * inspired by Pesticide CSS with enhanced features and better performance.
 */

// Color palette for different element types
const OUTLINE_COLORS = {
  body: "#2980b9",
  article: "#3498db",
  nav: "#0088c3",
  aside: "#33a0ce",
  section: "#66b8da",
  header: "#99cfe7",
  footer: "#cce7f3",
  h1: "#162544",
  h2: "#314e6e",
  h3: "#3e5e85",
  h4: "#449baf",
  h5: "#c7d1cb",
  h6: "#4371d0",
  main: "#2f4f90",
  address: "#1a2c51",
  div: "#036cdb",
  p: "#ac050b",
  hr: "#ff063f",
  pre: "#850440",
  blockquote: "#f1b8e7",
  ol: "#ff050c",
  ul: "#d90416",
  li: "#d90416",
  dl: "#fd3427",
  dt: "#ff0043",
  dd: "#e80174",
  figure: "#f0b",
  figcaption: "#bf0032",
  table: "#0c9",
  caption: "#37ffc4",
  thead: "#98daca",
  tbody: "#64a7a0",
  tfoot: "#22746b",
  tr: "#86c0b2",
  th: "#a1e7d6",
  td: "#3f5a54",
  col: "#6c9a8f",
  colgroup: "#6c9a9d",
  button: "#da8301",
  datalist: "#c06000",
  fieldset: "#d95100",
  form: "#d23600",
  input: "#fca600",
  keygen: "#b31e00",
  label: "#ee8900",
  legend: "#de6d00",
  meter: "#e8630c",
  optgroup: "#b33600",
  option: "#ff8a00",
  output: "#ff9619",
  progress: "#e57c00",
  select: "#e26e0f",
  textarea: "#cc5400",
  details: "#33848f",
  summary: "#60a1a6",
  command: "#438da1",
  menu: "#449da6",
  del: "#bf0000",
  ins: "#400000",
  img: "#22746b",
  iframe: "#64a7a0",
  embed: "#98daca",
  object: "#0c9",
  param: "#37ffc4",
  video: "#6ee866",
  audio: "#027353",
  source: "#012426",
  canvas: "#a2f570",
  track: "#59a600",
  map: "#7be500",
  area: "#305900",
  a: "#ff62ab",
  em: "#800b41",
  strong: "#ff1583",
  i: "#803156",
  b: "#cc1169",
  u: "#ff0430",
  s: "#f805e3",
  small: "#d107b2",
  abbr: "#4a0263",
  q: "#240018",
  cite: "#64003c",
  dfn: "#b4005a",
  sub: "#dba0c8",
  sup: "#cc0256",
  time: "#d6606d",
  code: "#e04251",
  kbd: "#5e001f",
  samp: "#9c0033",
  var: "#d90047",
  mark: "#ff0053",
  bdi: "#bf3668",
  bdo: "#6f1400",
  ruby: "#ff7b93",
  rt: "#ff2f54",
  rp: "#803e49",
  span: "#cc2643",
  br: "#db687d",
  wbr: "#db175b"
} as const

/**
 * Configuration options for the element outliner
 */
export interface ElementOutlinerOptions {
  /** Whether to show hover effects */
  enableHover?: boolean
  /** Custom colors for specific elements */
  customColors?: Record<string, string>
  /** Elements to exclude from outlining */
  excludeSelectors?: string[]
  /** CSS selector for elements to exclude from hover effects */
  excludeFromHover?: string
}

/**
 * Element outliner instance
 */
export interface ElementOutliner {
  /** Start outlining elements */
  start(): void
  /** Stop outlining elements */
  stop(): void
  /** Toggle outlining on/off */
  toggle(): boolean
  /** Check if outlining is currently active */
  isActive(): boolean
  /** Update configuration */
  configure(options: ElementOutlinerOptions): void
  /** Destroy the outliner and clean up */
  destroy(): void
}

/**
 * Create a new element outliner instance
 */
export function createElementOutliner(options: ElementOutlinerOptions = {}): ElementOutliner {
  let isOutlining = false
  let styleElement: HTMLStyleElement | null = null
  let currentOptions: ElementOutlinerOptions = {
    enableHover: true,
    excludeFromHover: '[data-highlight-box]',
    ...options
  }

  /**
   * Generate CSS for outlining elements
   */
  function generateOutlineCSS(): string {
    const colors = { ...OUTLINE_COLORS, ...currentOptions.customColors }
    let css = "/* Element Outliner - Inspired by Pesticide CSS */\n"

    // Add outline styles for each element type
    Object.entries(colors).forEach(([element, color]) => {
      const excludeSelectors = currentOptions.excludeSelectors || []
      const excludeString = excludeSelectors.length > 0
        ? `:not(${excludeSelectors.join('):not(')})`
        : ''

      css += `${element}${excludeString} { outline: 1px solid ${color} !important; }\n`
    })

    // Add hover styles if enabled
    if (currentOptions.enableHover) {
      const excludeFromHover = currentOptions.excludeFromHover || ''
      const hoverExclude = excludeFromHover ? `:not(${excludeFromHover})` : ''

      css += `
      /* Hover effects */
      body *${hoverExclude}:hover {
        outline-width: 2px !important;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) !important;
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      `
    }

    return css
  }

  /**
   * Start outlining elements
   */
  function start(): void {
    if (isOutlining) return

    isOutlining = true

    // Create or update style element
    if (!styleElement) {
      styleElement = document.createElement("style")
      styleElement.id = "element-outliner-styles"
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = generateOutlineCSS()
  }

  /**
   * Stop outlining elements
   */
  function stop(): void {
    if (!isOutlining) return

    isOutlining = false

    // Remove the style element
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement)
      styleElement = null
    }
  }

  /**
   * Toggle element outlining
   */
  function toggle(): boolean {
    if (isOutlining) {
      stop()
    } else {
      start()
    }
    return isOutlining
  }

  /**
   * Check if outlining is currently active
   */
  function isActive(): boolean {
    return isOutlining
  }

  /**
   * Update configuration
   */
  function configure(newOptions: ElementOutlinerOptions): void {
    currentOptions = { ...currentOptions, ...newOptions }

    // If currently active, restart with new options
    if (isOutlining) {
      stop()
      start()
    }
  }

  /**
   * Destroy the outliner and clean up
   */
  function destroy(): void {
    stop()
    styleElement = null
  }

  return {
    start,
    stop,
    toggle,
    isActive,
    configure,
    destroy
  }
}

/**
 * Default export for convenience
 */
export default createElementOutliner

/**
 * Export the color palette for customization
 */
export { OUTLINE_COLORS }
