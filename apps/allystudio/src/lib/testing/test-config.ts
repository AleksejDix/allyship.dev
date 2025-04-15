// No imports needed - all tests now use ACT rules

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
  | "ai-language"
  | "structure"
  | "focus"

/**
 * Configuration for accessibility tests
 *
 * MIGRATION COMPLETE: We've fully migrated to generic events.
 * All components now use the generic TEST_ANALYSIS_COMPLETE event
 * instead of specific event types.
 *
 * ACT MIGRATION COMPLETE: All tests now use ACT rules.
 */
export interface TestConfig {
  // Test identification
  type: TestType

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
    displayName: "Heading Structure",
    buttonText: {
      enable: "Enable Heading Analysis",
      disable: "Disable Heading Analysis"
    },
    statsText: {
      label: "Headings",
      itemName: "heading"
    },
    layerName: "headings"
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
    layerName: "links"
  },
  alt: {
    type: "alt",
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
    layerName: "buttons"
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
    layerName: "forms"
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
    layerName: "landmarks"
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
    layerName: "aria"
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
    layerName: "color"
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
    layerName: "tables"
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
    layerName: "language"
  },
  "ai-language": {
    type: "ai-language",
    displayName: "AI Language Check",
    buttonText: {
      enable: "Enable AI Language Check",
      disable: "Disable AI Language Check"
    },
    statsText: {
      label: "Found",
      itemName: "language issues"
    },
    layerName: "language"
  },
  structure: {
    type: "structure",
    displayName: "Document Structure",
    buttonText: {
      enable: "Enable Structure Analysis",
      disable: "Disable Structure Analysis"
    },
    statsText: {
      label: "Structure Elements",
      itemName: "element"
    },
    layerName: "structure"
  },
  focus: {
    type: "focus",
    displayName: "Focus Indicators",
    buttonText: {
      enable: "Enable Focus Analysis",
      disable: "Disable Focus Analysis"
    },
    statsText: {
      label: "Focus Elements",
      itemName: "element"
    },
    layerName: "focus"
  }
}
