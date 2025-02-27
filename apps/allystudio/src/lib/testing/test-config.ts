import { altTests, headingTests, interactiveTests, linkTests } from "./suites"

export type TestType =
  | "headings"
  | "links"
  | "alt"
  | "interactive"
  | "buttons"
  | "forms"
  | "landmarks"
  | "aria"
  | "color"
  | "tables"
  | "language"
  | "structure"

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
  suite?:
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

  // Test runner configuration
  runner?: string // The name of the runner module to use (e.g., "heading-runner.ts")
  useACTRules?: boolean // Whether to use ACT rules for this test
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
    layerName: "headings",
    runner: "heading-runner.ts"
  },
  links: {
    type: "links",
    displayName: "Link Accessibility",
    buttonText: {
      enable: "Enable Link Analysis",
      disable: "Disable Link Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "links"
    },
    layerName: "links",
    useACTRules: true
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
    layerName: "images",
    runner: "alt-runner.ts"
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
    layerName: "interactive",
    runner: "interactive-runner.ts"
  },
  // New ACT rule-based tests
  buttons: {
    type: "buttons",
    displayName: "Button Accessibility",
    buttonText: {
      enable: "Enable Button Analysis",
      disable: "Disable Button Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "buttons"
    },
    layerName: "buttons",
    useACTRules: true
  },
  forms: {
    type: "forms",
    displayName: "Form Accessibility",
    buttonText: {
      enable: "Enable Form Analysis",
      disable: "Disable Form Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "form elements"
    },
    layerName: "forms",
    useACTRules: true
  },
  landmarks: {
    type: "landmarks",
    displayName: "Landmark Regions",
    buttonText: {
      enable: "Enable Landmark Analysis",
      disable: "Disable Landmark Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "landmarks"
    },
    layerName: "landmarks",
    useACTRules: true
  },
  aria: {
    type: "aria",
    displayName: "ARIA Usage",
    buttonText: {
      enable: "Enable ARIA Analysis",
      disable: "Disable ARIA Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "ARIA elements"
    },
    layerName: "aria",
    useACTRules: true
  },
  color: {
    type: "color",
    displayName: "Color & Contrast",
    buttonText: {
      enable: "Enable Color Analysis",
      disable: "Disable Color Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "contrast issues"
    },
    layerName: "color",
    useACTRules: true
  },
  tables: {
    type: "tables",
    displayName: "Table Accessibility",
    buttonText: {
      enable: "Enable Table Analysis",
      disable: "Disable Table Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "tables"
    },
    layerName: "tables",
    useACTRules: true
  },
  language: {
    type: "language",
    displayName: "Language Settings",
    buttonText: {
      enable: "Enable Language Analysis",
      disable: "Disable Language Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "language issues"
    },
    layerName: "language",
    useACTRules: true
  },
  structure: {
    type: "structure",
    displayName: "Document Structure",
    buttonText: {
      enable: "Enable Structure Analysis",
      disable: "Disable Structure Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "structure issues"
    },
    layerName: "structure",
    useACTRules: true
  }
}
