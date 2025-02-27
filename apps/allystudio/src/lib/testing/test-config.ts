import { altTests, headingTests, interactiveTests, linkTests } from "./suites"

export type TestType = "headings" | "links" | "alt" | "interactive"

/**
 * Configuration for accessibility tests
 *
 * MIGRATION COMPLETE: We've fully migrated to generic events.
 * All components now use the generic TEST_ANALYSIS_COMPLETE event
 * instead of specific event types.
 */
export interface TestConfig {
  // Test identification
  type: TestType
  suite:
    | typeof headingTests
    | typeof linkTests
    | typeof altTests
    | typeof interactiveTests

  // UI display configuration
  displayName: string
  buttonText: {
    enable: string
    disable: string
  }
  statsText: {
    label: string
    itemName: string
  }

  // Layer mapping for visualization
  layerName: string // Maps test types to layer names
}

export const TEST_CONFIGS: Record<TestType, TestConfig> = {
  headings: {
    type: "headings",
    suite: headingTests,
    displayName: "Heading Structure",
    buttonText: {
      enable: "Enable Heading Analysis",
      disable: "Disable Heading Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "headings"
    },
    layerName: "headings"
  },
  links: {
    type: "links",
    suite: linkTests,
    displayName: "Link Accessibility",
    buttonText: {
      enable: "Enable Link Analysis",
      disable: "Disable Link Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "links"
    },
    layerName: "links"
  },
  alt: {
    type: "alt",
    suite: altTests,
    displayName: "Alt Text Analysis",
    buttonText: {
      enable: "Enable Alt Text Analysis",
      disable: "Disable Alt Text Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "images"
    },
    layerName: "images"
  },
  interactive: {
    type: "interactive",
    suite: interactiveTests,
    displayName: "Interactive Elements",
    buttonText: {
      enable: "Enable Interactive Analysis",
      disable: "Disable Interactive Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "elements"
    },
    layerName: "interactive"
  }
}
