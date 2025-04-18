// EAA links constants file

// Base path for EAA section
export const EAA_BASE_PATH = '/eaa'

// External links
export const EXTERNAL_LINKS = {
  OFFICIAL_EAA_TEXT:
    'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882',
  W3C_WCAG: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
  EN_301_549:
    'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf',
}

// Introduction section
export const INTRODUCTION_LINKS = {
  OVERVIEW: {
    path: '',
    label: 'Overview',
    fullPath: `${EAA_BASE_PATH}`,
  },
  PURPOSE_AND_DEFINITIONS: {
    path: '/1.1-purpose-and-definitions',
    label: 'Purpose & Definitions',
    fullPath: `${EAA_BASE_PATH}/1.1-purpose-and-definitions`,
  },
  SCOPE: {
    path: '/1.2-scope',
    label: 'Scope & Application',
    fullPath: `${EAA_BASE_PATH}/1.2-scope`,
  },
  EXISTING_LAW: {
    path: '/1.3-existing-law',
    label: 'Existing Union Law',
    fullPath: `${EAA_BASE_PATH}/1.3-existing-law`,
  },
  FREE_MOVEMENT: {
    path: '/1.4-free-movement',
    label: 'Free Movement',
    fullPath: `${EAA_BASE_PATH}/1.4-free-movement`,
  },
}

// Requirements section
export const REQUIREMENTS_LINKS = {
  ACCESSIBILITY_REQUIREMENTS: {
    path: '/2.1-accessibility-requirements',
    label: 'Accessibility Requirements',
    fullPath: `${EAA_BASE_PATH}/2.1-accessibility-requirements`,
  },
}

// Obligations section
export const OBLIGATIONS_LINKS = {
  OVERVIEW: {
    path: '/2.2-obligations-overview',
    label: 'Overview',
    fullPath: `${EAA_BASE_PATH}/2.2-obligations-overview`,
  },
  MANUFACTURERS: {
    path: '/2.3-obligations-manufacturers',
    label: 'For Manufacturers',
    fullPath: `${EAA_BASE_PATH}/2.3-obligations-manufacturers`,
  },
  IMPORTERS: {
    path: '/2.4-obligations-importers',
    label: 'For Importers',
    fullPath: `${EAA_BASE_PATH}/2.4-obligations-importers`,
  },
  DISTRIBUTORS: {
    path: '/2.5-obligations-distributors',
    label: 'For Distributors',
    fullPath: `${EAA_BASE_PATH}/2.5-obligations-distributors`,
  },
  SERVICE_PROVIDERS: {
    path: '/2.6-obligations-service-providers',
    label: 'For Service Providers',
    fullPath: `${EAA_BASE_PATH}/2.6-obligations-service-providers`,
  },
}

// Compliance section
export const COMPLIANCE_LINKS = {
  CONFORMITY: {
    path: '/3.1-conformity',
    label: 'Conformity of Products',
    fullPath: `${EAA_BASE_PATH}/3.1-conformity`,
  },
  EU_DECLARATION: {
    path: '/3.2-eu-declaration',
    label: 'EU Declaration',
    fullPath: `${EAA_BASE_PATH}/3.2-eu-declaration`,
  },
  CE_MARKING: {
    path: '/3.3-ce-marking',
    label: 'CE Marking',
    fullPath: `${EAA_BASE_PATH}/3.3-ce-marking`,
  },
  MARKET_SURVEILLANCE: {
    path: '/3.4-market-surveillance',
    label: 'Market Surveillance',
    fullPath: `${EAA_BASE_PATH}/3.4-market-surveillance`,
  },
  SERVICE_COMPLIANCE: {
    path: '/3.5-service-compliance',
    label: 'Service Compliance',
    fullPath: `${EAA_BASE_PATH}/3.5-service-compliance`,
  },
  NON_COMPLIANCE: {
    path: '/3.6-non-compliance-procedure',
    label: 'Non-Compliance Procedures',
    fullPath: `${EAA_BASE_PATH}/3.6-non-compliance-procedure`,
  },
  HARMONIZED_STANDARDS: {
    path: '/3.7-harmonized-standards',
    label: 'Harmonized Standards',
    fullPath: `${EAA_BASE_PATH}/3.7-harmonized-standards`,
  },
}

// Exceptions section
export const EXCEPTIONS_LINKS = {
  FUNDAMENTAL_ALTERATION: {
    path: '/3.8-fundamental-alteration',
    label: 'Fundamental Alteration',
    fullPath: `${EAA_BASE_PATH}/3.8-fundamental-alteration`,
  },
}

// Annexes section
export const ANNEXES_LINKS = {
  OVERVIEW: {
    path: '/4.0-annexes',
    label: 'All Annexes',
    fullPath: `${EAA_BASE_PATH}/4.0-annexes`,
  },
  ACCESSIBILITY_REQUIREMENTS: {
    path: '/4.1-annex1-accessibility-requirements',
    label: 'I: Accessibility Requirements',
    fullPath: `${EAA_BASE_PATH}/4.1-annex1-accessibility-requirements`,
    related: [
      'ANNEXES.OVERVIEW',
      'ANNEXES.IMPLEMENTATION_EXAMPLES',
      'REQUIREMENTS.ACCESSIBILITY_REQUIREMENTS',
    ],
  },
  IMPLEMENTATION_EXAMPLES: {
    path: '/4.2-annex2-implementation-examples',
    label: 'II: Implementation Examples',
    fullPath: `${EAA_BASE_PATH}/4.2-annex2-implementation-examples`,
    related: ['ANNEXES.OVERVIEW', 'ANNEXES.ACCESSIBILITY_REQUIREMENTS'],
  },
  BUILT_ENVIRONMENT: {
    path: '/4.3-annex3-built-environment',
    label: 'III: Built Environment',
    fullPath: `${EAA_BASE_PATH}/4.3-annex3-built-environment`,
    related: ['ANNEXES.OVERVIEW', 'EXCEPTIONS.FUNDAMENTAL_ALTERATION'],
  },
  DISPROPORTIONATE_BURDEN: {
    path: '/4.4-annex4-disproportionate-burden',
    label: 'IV: Disproportionate Burden',
    fullPath: `${EAA_BASE_PATH}/4.4-annex4-disproportionate-burden`,
    related: ['ANNEXES.OVERVIEW', 'ANNEXES.ASSESSMENT_CRITERIA'],
  },
  CONFORMITY_ASSESSMENT: {
    path: '/4.5-annex5-conformity-assessment',
    label: 'V: Conformity Assessment',
    fullPath: `${EAA_BASE_PATH}/4.5-annex5-conformity-assessment`,
    related: [
      'ANNEXES.OVERVIEW',
      'COMPLIANCE.CONFORMITY',
      'COMPLIANCE.EU_DECLARATION',
    ],
  },
  ASSESSMENT_CRITERIA: {
    path: '/4.6-annex6-assessment-criteria',
    label: 'VI: Assessment Criteria',
    fullPath: `${EAA_BASE_PATH}/4.6-annex6-assessment-criteria`,
    related: ['ANNEXES.OVERVIEW', 'ANNEXES.DISPROPORTIONATE_BURDEN'],
  },
}

// Implementation section
export const IMPLEMENTATION_LINKS = {
  IMPLEMENTATION: {
    path: '/5.1-implementation',
    label: 'Implementation',
    fullPath: `${EAA_BASE_PATH}/5.1-implementation`,
  },
  TECHNICAL_STANDARDS: {
    path: '/5.2-technical-standards',
    label: 'Technical Standards',
    fullPath: `${EAA_BASE_PATH}/5.2-technical-standards`,
  },
}

// Navigation sections for sidebar - updated to include new structure
export const ALL_NAVIGATION_SECTIONS = [
  {
    title: 'Introduction',
    icon: 'Info',
    items: Object.values(INTRODUCTION_LINKS),
  },
  {
    title: 'Requirements & Obligations',
    icon: 'FileText',
    items: [
      ...Object.values(REQUIREMENTS_LINKS),
      ...Object.values(OBLIGATIONS_LINKS),
    ],
  },
  {
    title: 'Compliance & Exceptions',
    icon: 'ShieldCheck',
    items: [
      ...Object.values(COMPLIANCE_LINKS),
      ...Object.values(EXCEPTIONS_LINKS),
    ],
  },
  {
    title: 'Annexes',
    icon: 'Book',
    items: Object.values(ANNEXES_LINKS),
  },
  {
    title: 'Implementation',
    icon: 'Settings',
    items: Object.values(IMPLEMENTATION_LINKS),
  },
]

// Type for link reference paths used in related links - updated for new structure
export type LinkRefPath =
  | 'INTRODUCTION.OVERVIEW'
  | 'INTRODUCTION.PURPOSE_AND_DEFINITIONS'
  | 'INTRODUCTION.SCOPE'
  | 'INTRODUCTION.EXISTING_LAW'
  | 'INTRODUCTION.FREE_MOVEMENT'
  | 'REQUIREMENTS.ACCESSIBILITY_REQUIREMENTS'
  | 'OBLIGATIONS.OVERVIEW'
  | 'OBLIGATIONS.MANUFACTURERS'
  | 'OBLIGATIONS.IMPORTERS'
  | 'OBLIGATIONS.DISTRIBUTORS'
  | 'OBLIGATIONS.SERVICE_PROVIDERS'
  | 'COMPLIANCE.CONFORMITY'
  | 'COMPLIANCE.EU_DECLARATION'
  | 'COMPLIANCE.CE_MARKING'
  | 'COMPLIANCE.MARKET_SURVEILLANCE'
  | 'COMPLIANCE.SERVICE_COMPLIANCE'
  | 'COMPLIANCE.NON_COMPLIANCE'
  | 'COMPLIANCE.HARMONIZED_STANDARDS'
  | 'EXCEPTIONS.FUNDAMENTAL_ALTERATION'
  | 'ANNEXES.OVERVIEW'
  | 'ANNEXES.ACCESSIBILITY_REQUIREMENTS'
  | 'ANNEXES.IMPLEMENTATION_EXAMPLES'
  | 'ANNEXES.BUILT_ENVIRONMENT'
  | 'ANNEXES.DISPROPORTIONATE_BURDEN'
  | 'ANNEXES.CONFORMITY_ASSESSMENT'
  | 'ANNEXES.ASSESSMENT_CRITERIA'
  | 'IMPLEMENTATION.IMPLEMENTATION'
  | 'IMPLEMENTATION.TECHNICAL_STANDARDS'

// Function to resolve a link reference path to the actual link object
export function getLinkByRefPath(refPath: LinkRefPath) {
  const [section, key] = refPath.split('.')

  switch (section) {
    case 'INTRODUCTION':
      return INTRODUCTION_LINKS[key as keyof typeof INTRODUCTION_LINKS]
    case 'REQUIREMENTS':
      return REQUIREMENTS_LINKS[key as keyof typeof REQUIREMENTS_LINKS]
    case 'OBLIGATIONS':
      return OBLIGATIONS_LINKS[key as keyof typeof OBLIGATIONS_LINKS]
    case 'COMPLIANCE':
      return COMPLIANCE_LINKS[key as keyof typeof COMPLIANCE_LINKS]
    case 'EXCEPTIONS':
      return EXCEPTIONS_LINKS[key as keyof typeof EXCEPTIONS_LINKS]
    case 'ANNEXES':
      return ANNEXES_LINKS[key as keyof typeof ANNEXES_LINKS]
    case 'IMPLEMENTATION':
      return IMPLEMENTATION_LINKS[key as keyof typeof IMPLEMENTATION_LINKS]
    default:
      return null
  }
}
