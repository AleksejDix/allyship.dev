/**
 * Navigation constants for the European Accessibility Act (EAA) section
 * This file centralizes all links and routing information for easier maintenance
 */

export interface LinkItem {
  href: string
  label: string
  description?: string
}

// Main EAA section links
export const mainEaaLinks: Record<string, LinkItem> = {
  overview: {
    href: '/eaa',
    label: 'EAA Overview',
    description: 'Introduction to the European Accessibility Act',
  },
  timeline: {
    href: '/eaa/timeline',
    label: 'EAA Timeline',
    description: 'Key implementation dates and deadlines',
  },
  guidelines: {
    href: '/eaa/guidelines',
    label: 'Implementation Guidelines',
    description: 'Practical guidance for implementing EAA requirements',
  },
  annexes: {
    href: '/eaa/annexes',
    label: 'Annexes',
    description: 'Detailed information on EAA annexes',
  },
  faq: {
    href: '/eaa/faq',
    label: 'Frequently Asked Questions',
    description: 'Common questions about the EAA',
  },
}

// Annexes section links
export const annexLinks: Record<string, LinkItem> = {
  annexesOverview: {
    href: '/eaa/annexes',
    label: 'Annexes Overview',
    description: 'Overview of all annexes in the EAA',
  },
  annexI: {
    href: '/eaa/annexes/accessibility-requirements',
    label: 'Annex I: Accessibility Requirements',
    description:
      'Detailed accessibility requirements for products and services',
  },
  annexII: {
    href: '/eaa/annexes/conformity-assessment',
    label: 'Annex II: Conformity Assessment',
    description:
      'Procedures for assessing conformity with accessibility requirements',
  },
  annexIII: {
    href: '/eaa/annexes/requirements-for-services',
    label: 'Annex III: Requirements for Services',
    description: 'Specific accessibility requirements for services',
  },
  annexIV: {
    href: '/eaa/annexes/disproportionate-burden-assessment',
    label: 'Annex IV: Disproportionate Burden Assessment',
    description: 'Framework for assessing disproportionate burden claims',
  },
}

// Disproportionate Burden links
export const disproportionateBurdenLinks: LinkItem[] = [
  {
    href: '/eaa/guides/disproportionate-burden',
    label: 'Disproportionate Burden Guide',
    description:
      'Comprehensive guide to applying the disproportionate burden concept',
  },
  {
    href: '/eaa/templates/burden-assessment',
    label: 'Assessment Template',
    description: 'Template for documenting disproportionate burden assessments',
  },
  {
    href: '/eaa/case-studies/burden-examples',
    label: 'Case Studies',
    description: 'Real-world examples of disproportionate burden assessments',
  },
]

// Accessibility Requirements links
export const accessibilityRequirementsLinks: LinkItem[] = [
  {
    href: '/eaa/guides/web-accessibility',
    label: 'Web Accessibility Guide',
    description: 'Implementation guide for web accessibility requirements',
  },
  {
    href: '/eaa/guides/mobile-accessibility',
    label: 'Mobile Accessibility Guide',
    description: 'Implementation guide for mobile application accessibility',
  },
  {
    href: '/eaa/guides/self-service-terminals',
    label: 'Self-Service Terminals Guide',
    description: 'Accessibility requirements for self-service terminals',
  },
]
