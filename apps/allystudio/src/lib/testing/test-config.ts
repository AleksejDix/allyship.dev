import { altTests, headingTests, interactiveTests, linkTests } from "./suites"

export type TestType = "headings" | "links" | "alt" | "interactive"

export interface TestConfig {
  type: TestType
  suite:
    | typeof headingTests
    | typeof linkTests
    | typeof altTests
    | typeof interactiveTests
  events: {
    complete:
      | "HEADING_ANALYSIS_COMPLETE"
      | "LINK_ANALYSIS_COMPLETE"
      | "ALT_ANALYSIS_COMPLETE"
      | "INTERACTIVE_ANALYSIS_COMPLETE"
    request:
      | "HEADING_ANALYSIS_REQUEST"
      | "LINK_ANALYSIS_REQUEST"
      | "ALT_ANALYSIS_REQUEST"
      | "INTERACTIVE_ANALYSIS_REQUEST"
  }
  displayName: string
  buttonText: {
    enable: string
    disable: string
  }
  statsText: {
    label: string
    itemName: string
  }
}

export const TEST_CONFIGS: Record<TestType, TestConfig> = {
  headings: {
    type: "headings",
    suite: headingTests,
    events: {
      complete: "HEADING_ANALYSIS_COMPLETE",
      request: "HEADING_ANALYSIS_REQUEST"
    },
    displayName: "Heading Structure",
    buttonText: {
      enable: "Enable Heading Analysis",
      disable: "Disable Heading Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "headings"
    }
  },
  links: {
    type: "links",
    suite: linkTests,
    events: {
      complete: "LINK_ANALYSIS_COMPLETE",
      request: "LINK_ANALYSIS_REQUEST"
    },
    displayName: "Link Accessibility",
    buttonText: {
      enable: "Enable Link Analysis",
      disable: "Disable Link Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "links"
    }
  },
  alt: {
    type: "alt",
    suite: altTests,
    events: {
      complete: "ALT_ANALYSIS_COMPLETE",
      request: "ALT_ANALYSIS_REQUEST"
    },
    displayName: "Alt Text Analysis",
    buttonText: {
      enable: "Enable Alt Text Analysis",
      disable: "Disable Alt Text Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "images"
    }
  },
  interactive: {
    type: "interactive",
    suite: interactiveTests,
    events: {
      complete: "INTERACTIVE_ANALYSIS_COMPLETE",
      request: "INTERACTIVE_ANALYSIS_REQUEST"
    },
    displayName: "Interactive Elements",
    buttonText: {
      enable: "Enable Interactive Analysis",
      disable: "Disable Interactive Analysis"
    },
    statsText: {
      label: "Found",
      itemName: "elements"
    }
  }
}
