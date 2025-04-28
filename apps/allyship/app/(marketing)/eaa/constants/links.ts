// EAA links constants file

// External links
export const EXTERNAL_LINKS = {
  OFFICIAL_EAA_TEXT:
    'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882',
  W3C_WCAG: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
  EN_301_549:
    'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf',
}

// Define the PageInfo interface
export type PageInfo = {
  path: string
  label: string
  fullPath: string
  prev: string | null
  next: string | null
}

// Define PAGES object for navigation functions based on the actual directory structure
export const PAGES: Record<string, PageInfo> = {
  // Foreword
  '0.0-foreword': {
    path: '/0.0-foreword',
    label: 'Foreword',
    fullPath: '/eaa/0.0-foreword',
    prev: null,
    next: '1.0-introduction',
  },
  // Introduction
  '1.0-introduction': {
    path: '/1.0-introduction',
    label: 'Introduction',
    fullPath: '/eaa/1.0-introduction',
    prev: '0.0-foreword',
    next: '1.1-purpose-and-definitions',
  },
  '1.1-purpose-and-definitions': {
    path: '/1.1-purpose-and-definitions',
    label: 'Purpose & Definitions',
    fullPath: '/eaa/1.1-purpose-and-definitions',
    prev: '1.0-introduction',
    next: '1.2-existing-law-and-free-movement',
  },
  '1.2-existing-law-and-free-movement': {
    path: '/1.2-existing-law-and-free-movement',
    label: 'Existing Law & Free Movement',
    fullPath: '/eaa/1.2-existing-law-and-free-movement',
    prev: '1.1-purpose-and-definitions',
    next: '1.3-implementation-timeline',
  },
  '1.3-implementation-timeline': {
    path: '/1.3-implementation-timeline',
    label: 'Implementation Timeline',
    fullPath: '/eaa/1.3-implementation-timeline',
    prev: '1.2-existing-law-and-free-movement',
    next: '2.0-scope-and-requirements',
  },
  // Scope and Requirements
  '2.0-scope-and-requirements': {
    path: '/2.0-scope-and-requirements',
    label: 'Scope and Requirements',
    fullPath: '/eaa/2.0-scope-and-requirements',
    prev: '1.3-implementation-timeline',
    next: '2.1-scope',
  },
  '2.1-scope': {
    path: '/2.1-scope',
    label: 'Scope',
    fullPath: '/eaa/2.1-scope',
    prev: '2.0-scope-and-requirements',
    next: '2.2-product-requirements',
  },
  '2.2-product-requirements': {
    path: '/2.2-product-requirements',
    label: 'Product Requirements',
    fullPath: '/eaa/2.2-product-requirements',
    prev: '2.1-scope',
    next: '2.3-service-requirements',
  },
  '2.3-service-requirements': {
    path: '/2.3-service-requirements',
    label: 'Service Requirements',
    fullPath: '/eaa/2.3-service-requirements',
    prev: '2.2-product-requirements',
    next: '2.4-sector-specific',
  },
  '2.4-sector-specific': {
    path: '/2.4-sector-specific',
    label: 'Sector-Specific Requirements',
    fullPath: '/eaa/2.4-sector-specific',
    prev: '2.3-service-requirements',
    next: '2.5-functional-performance-criteria',
  },
  '2.5-functional-performance-criteria': {
    path: '/2.5-functional-performance-criteria',
    label: 'Functional Performance Criteria',
    fullPath: '/eaa/2.5-functional-performance-criteria',
    prev: '2.4-sector-specific',
    next: '2.6-built-environment',
  },
  '2.6-built-environment': {
    path: '/2.6-built-environment',
    label: 'Built Environment',
    fullPath: '/eaa/2.6-built-environment',
    prev: '2.5-functional-performance-criteria',
    next: '2.7-technical-criteria',
  },
  '2.7-technical-criteria': {
    path: '/2.7-technical-criteria',
    label: 'Technical Criteria',
    fullPath: '/eaa/2.7-technical-criteria',
    prev: '2.6-built-environment',
    next: '3.0-exceptions',
  },
  // Exceptions
  '3.0-exceptions': {
    path: '/3.0-exceptions',
    label: 'Exceptions',
    fullPath: '/eaa/3.0-exceptions',
    prev: '2.7-technical-criteria',
    next: '3.1-disproportionate-burden',
  },
  '3.1-disproportionate-burden': {
    path: '/3.1-disproportionate-burden',
    label: 'Disproportionate Burden',
    fullPath: '/eaa/3.1-disproportionate-burden',
    prev: '3.0-exceptions',
    next: '3.2-fundamental-alteration',
  },
  '3.2-fundamental-alteration': {
    path: '/3.2-fundamental-alteration',
    label: 'Fundamental Alteration',
    fullPath: '/eaa/3.2-fundamental-alteration',
    prev: '3.1-disproportionate-burden',
    next: '3.3-microenterprises',
  },
  '3.3-microenterprises': {
    path: '/3.3-microenterprises',
    label: 'Microenterprises',
    fullPath: '/eaa/3.3-microenterprises',
    prev: '3.2-fundamental-alteration',
    next: '4.0-obligations',
  },
  // Obligations
  '4.0-obligations': {
    path: '/4.0-obligations',
    label: 'Obligations',
    fullPath: '/eaa/4.0-obligations',
    prev: '3.3-microenterprises',
    next: '4.1-obligations-manufacturers',
  },
  '4.1-obligations-manufacturers': {
    path: '/4.1-obligations-manufacturers',
    label: 'Obligations of Manufacturers',
    fullPath: '/eaa/4.1-obligations-manufacturers',
    prev: '4.0-obligations',
    next: '4.2-obligations-importers',
  },
  '4.2-obligations-importers': {
    path: '/4.2-obligations-importers',
    label: 'Obligations of Importers',
    fullPath: '/eaa/4.2-obligations-importers',
    prev: '4.1-obligations-manufacturers',
    next: '4.3-obligations-distributors',
  },
  '4.3-obligations-distributors': {
    path: '/4.3-obligations-distributors',
    label: 'Obligations of Distributors',
    fullPath: '/eaa/4.3-obligations-distributors',
    prev: '4.2-obligations-importers',
    next: '4.4-obligations-service-providers',
  },
  '4.4-obligations-service-providers': {
    path: '/4.4-obligations-service-providers',
    label: 'Obligations of Service Providers',
    fullPath: '/eaa/4.4-obligations-service-providers',
    prev: '4.3-obligations-distributors',
    next: '5.0-conformity-and-compliance',
  },
  // Conformity and Compliance
  '5.0-conformity-and-compliance': {
    path: '/5.0-conformity-and-compliance',
    label: 'Conformity and Compliance',
    fullPath: '/eaa/5.0-conformity-and-compliance',
    prev: '4.4-obligations-service-providers',
    next: '5.1-product-conformity',
  },
  '5.1-product-conformity': {
    path: '/5.1-product-conformity',
    label: 'Product Conformity',
    fullPath: '/eaa/5.1-product-conformity',
    prev: '5.0-conformity-and-compliance',
    next: '5.2-service-conformity',
  },
  '5.2-service-conformity': {
    path: '/5.2-service-conformity',
    label: 'Service Conformity',
    fullPath: '/eaa/5.2-service-conformity',
    prev: '5.1-product-conformity',
    next: '5.3-eu-declaration-of-conformity',
  },
  '5.3-eu-declaration-of-conformity': {
    path: '/5.3-eu-declaration-of-conformity',
    label: 'EU Declaration of Conformity',
    fullPath: '/eaa/5.3-eu-declaration-of-conformity',
    prev: '5.2-service-conformity',
    next: '5.4-ce-marking',
  },
  '5.4-ce-marking': {
    path: '/5.4-ce-marking',
    label: 'CE Marking',
    fullPath: '/eaa/5.4-ce-marking',
    prev: '5.3-eu-declaration-of-conformity',
    next: '5.5-harmonized-standards',
  },
  '5.5-harmonized-standards': {
    path: '/5.5-harmonized-standards',
    label: 'Harmonized Standards',
    fullPath: '/eaa/5.5-harmonized-standards',
    prev: '5.4-ce-marking',
    next: '5.6-non-conformity-procedures',
  },
  '5.6-non-conformity-procedures': {
    path: '/5.6-non-conformity-procedures',
    label: 'Non-Conformity Procedures',
    fullPath: '/eaa/5.6-non-conformity-procedures',
    prev: '5.5-harmonized-standards',
    next: '5.7-conformity-assessment-procedure',
  },
  '5.7-conformity-assessment-procedure': {
    path: '/5.7-conformity-assessment-procedure',
    label: 'Conformity Assessment Procedure',
    fullPath: '/eaa/5.7-conformity-assessment-procedure',
    prev: '5.6-non-conformity-procedures',
    next: '5.8-market-surveillance',
  },
  '5.8-market-surveillance': {
    path: '/5.8-market-surveillance',
    label: 'Market Surveillance',
    fullPath: '/eaa/5.8-market-surveillance',
    prev: '5.7-conformity-assessment-procedure',
    next: '6.0-monitoring',
  },
  // Monitoring
  '6.0-monitoring': {
    path: '/6.0-monitoring',
    label: 'Monitoring',
    fullPath: '/eaa/6.0-monitoring',
    prev: '5.8-market-surveillance',
    next: '6.1-authorities',
  },
  '6.1-authorities': {
    path: '/6.1-authorities',
    label: 'Authorities',
    fullPath: '/eaa/6.1-authorities',
    prev: '6.0-monitoring',
    next: '6.2-market-surveillance',
  },
  '6.2-market-surveillance': {
    path: '/6.2-market-surveillance',
    label: 'Market Surveillance',
    fullPath: '/eaa/6.2-market-surveillance',
    prev: '6.1-authorities',
    next: '6.3-complaint-systems',
  },
  '6.3-complaint-systems': {
    path: '/6.3-complaint-systems',
    label: 'Complaint Systems',
    fullPath: '/eaa/6.3-complaint-systems',
    prev: '6.2-market-surveillance',
    next: '6.4-periodic-reviews',
  },
  '6.4-periodic-reviews': {
    path: '/6.4-periodic-reviews',
    label: 'Periodic Reviews',
    fullPath: '/eaa/6.4-periodic-reviews',
    prev: '6.3-complaint-systems',
    next: null,
  },
}

// Helper functions to get next/prev pages
export function getNextPage(currentPageId: string): PageInfo | null {
  const currentPage = PAGES[currentPageId]
  if (!currentPage || !currentPage.next) return null
  return PAGES[currentPage.next] || null
}

export function getPrevPage(currentPageId: string): PageInfo | null {
  const currentPage = PAGES[currentPageId]
  if (!currentPage || !currentPage.prev) return null
  return PAGES[currentPage.prev] || null
}
