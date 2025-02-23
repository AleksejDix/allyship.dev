import { altTests } from "./alt-tests"
import { headingTests } from "./heading-tests"
import { linkTests } from "./link-tests"

export type TestType = "headings" | "links" | "alt"

export interface TestConfig {
  type: TestType
  suite: typeof headingTests | typeof linkTests | typeof altTests
  events: {
    complete:
      | "HEADING_ANALYSIS_COMPLETE"
      | "LINK_ANALYSIS_COMPLETE"
      | "ALT_ANALYSIS_COMPLETE"
    request:
      | "HEADING_ANALYSIS_REQUEST"
      | "LINK_ANALYSIS_REQUEST"
      | "ALT_ANALYSIS_REQUEST"
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
  }
}
