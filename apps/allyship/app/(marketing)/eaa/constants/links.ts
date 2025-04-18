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
    path: '/purpose-and-definitions',
    label: 'Purpose & Definitions',
    fullPath: `${EAA_BASE_PATH}/purpose-and-definitions`,
  },
  SCOPE: {
    path: '/scope',
    label: 'Scope & Application',
    fullPath: `${EAA_BASE_PATH}/scope`,
  },
  FREE_MOVEMENT: {
    path: '/free-movement',
    label: 'Free Movement',
    fullPath: `${EAA_BASE_PATH}/free-movement`,
  },
}

// Requirements section
export const REQUIREMENTS_LINKS = {
  ACCESSIBILITY_REQUIREMENTS: {
    path: '/accessibility-requirements',
    label: 'Accessibility Requirements',
    fullPath: `${EAA_BASE_PATH}/accessibility-requirements`,
  },
  EXISTING_LAW: {
    path: '/existing-law',
    label: 'Existing Union Law',
    fullPath: `${EAA_BASE_PATH}/existing-law`,
  },
  HARMONIZED_STANDARDS: {
    path: '/harmonized-standards',
    label: 'Harmonized Standards',
    fullPath: `${EAA_BASE_PATH}/harmonized-standards`,
  },
}

// Obligations section
export const OBLIGATIONS_LINKS = {
  OVERVIEW: {
    path: '/obligations',
    label: 'Overview',
    fullPath: `${EAA_BASE_PATH}/obligations`,
  },
  MANUFACTURERS: {
    path: '/obligations-manufacturers',
    label: 'For Manufacturers',
    fullPath: `${EAA_BASE_PATH}/obligations-manufacturers`,
  },
  IMPORTERS: {
    path: '/obligations-importers',
    label: 'For Importers',
    fullPath: `${EAA_BASE_PATH}/obligations-importers`,
  },
  DISTRIBUTORS: {
    path: '/obligations-distributors',
    label: 'For Distributors',
    fullPath: `${EAA_BASE_PATH}/obligations-distributors`,
  },
  SERVICE_PROVIDERS: {
    path: '/obligations-service-providers',
    label: 'For Service Providers',
    fullPath: `${EAA_BASE_PATH}/obligations-service-providers`,
  },
}

// Compliance section
export const COMPLIANCE_LINKS = {
  CONFORMITY: {
    path: '/conformity',
    label: 'Conformity of Products',
    fullPath: `${EAA_BASE_PATH}/conformity`,
  },
  EU_DECLARATION: {
    path: '/eu-declaration',
    label: 'EU Declaration',
    fullPath: `${EAA_BASE_PATH}/eu-declaration`,
  },
  CE_MARKING: {
    path: '/ce-marking',
    label: 'CE Marking',
    fullPath: `${EAA_BASE_PATH}/ce-marking`,
  },
  MARKET_SURVEILLANCE: {
    path: '/market-surveillance',
    label: 'Market Surveillance',
    fullPath: `${EAA_BASE_PATH}/market-surveillance`,
  },
  SERVICE_COMPLIANCE: {
    path: '/service-compliance',
    label: 'Service Compliance',
    fullPath: `${EAA_BASE_PATH}/service-compliance`,
  },
  NON_COMPLIANCE: {
    path: '/non-compliance-procedure',
    label: 'Non-Compliance Procedures',
    fullPath: `${EAA_BASE_PATH}/non-compliance-procedure`,
  },
}

// Exceptions section
export const EXCEPTIONS_LINKS = {
  FUNDAMENTAL_ALTERATION: {
    path: '/fundamental-alteration',
    label: 'Fundamental Alteration',
    fullPath: `${EAA_BASE_PATH}/fundamental-alteration`,
  },
}

// Annexes section
export const ANNEXES_LINKS = {
  OVERVIEW: {
    path: '/annexes',
    label: 'All Annexes',
    fullPath: `${EAA_BASE_PATH}/annexes`,
  },
  ACCESSIBILITY_REQUIREMENTS: {
    path: '/annexes/accessibility-requirements',
    label: 'I: Accessibility Requirements',
    fullPath: `${EAA_BASE_PATH}/annexes/accessibility-requirements`,
    related: [
      'ANNEXES.OVERVIEW',
      'ANNEXES.IMPLEMENTATION_EXAMPLES',
      'REQUIREMENTS.ACCESSIBILITY_REQUIREMENTS',
    ],
  },
  IMPLEMENTATION_EXAMPLES: {
    path: '/annexes/implementation-examples',
    label: 'II: Implementation Examples',
    fullPath: `${EAA_BASE_PATH}/annexes/implementation-examples`,
    related: ['ANNEXES.OVERVIEW', 'ANNEXES.ACCESSIBILITY_REQUIREMENTS'],
  },
  BUILT_ENVIRONMENT: {
    path: '/annexes/built-environment',
    label: 'III: Built Environment',
    fullPath: `${EAA_BASE_PATH}/annexes/built-environment`,
    related: ['ANNEXES.OVERVIEW', 'EXCEPTIONS.FUNDAMENTAL_ALTERATION'],
  },
  DISPROPORTIONATE_BURDEN: {
    path: '/annexes/disproportionate-burden-assessment',
    label: 'IV: Disproportionate Burden',
    fullPath: `${EAA_BASE_PATH}/annexes/disproportionate-burden-assessment`,
    related: ['ANNEXES.OVERVIEW', 'ANNEXES.ASSESSMENT_CRITERIA'],
  },
  CONFORMITY_ASSESSMENT: {
    path: '/annexes/conformity-assessment-products',
    label: 'V: Conformity Assessment',
    fullPath: `${EAA_BASE_PATH}/annexes/conformity-assessment-products`,
    related: [
      'ANNEXES.OVERVIEW',
      'COMPLIANCE.CONFORMITY',
      'COMPLIANCE.EU_DECLARATION',
    ],
  },
  ASSESSMENT_CRITERIA: {
    path: '/annexes/criteria-disproportionate-burden',
    label: 'VI: Assessment Criteria',
    fullPath: `${EAA_BASE_PATH}/annexes/criteria-disproportionate-burden`,
    related: ['ANNEXES.OVERVIEW', 'ANNEXES.DISPROPORTIONATE_BURDEN'],
  },
}

// Navigation sections for sidebar
export const ALL_NAVIGATION_SECTIONS = [
  {
    title: 'Introduction',
    icon: 'Info',
    items: Object.values(INTRODUCTION_LINKS),
  },
  {
    title: 'Requirements',
    icon: 'FileText',
    items: Object.values(REQUIREMENTS_LINKS),
  },
  {
    title: 'Obligations',
    icon: 'UserCheck',
    items: Object.values(OBLIGATIONS_LINKS),
  },
  {
    title: 'Compliance',
    icon: 'ShieldCheck',
    items: Object.values(COMPLIANCE_LINKS),
  },
  {
    title: 'Exceptions',
    icon: 'Settings',
    items: Object.values(EXCEPTIONS_LINKS),
  },
  {
    title: 'Annexes',
    icon: 'Book',
    items: Object.values(ANNEXES_LINKS),
  },
]

// Type for link reference paths used in related links
export type LinkRefPath =
  | 'INTRODUCTION.OVERVIEW'
  | 'INTRODUCTION.PURPOSE_AND_DEFINITIONS'
  | 'INTRODUCTION.SCOPE'
  | 'INTRODUCTION.FREE_MOVEMENT'
  | 'REQUIREMENTS.ACCESSIBILITY_REQUIREMENTS'
  | 'REQUIREMENTS.EXISTING_LAW'
  | 'REQUIREMENTS.HARMONIZED_STANDARDS'
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
  | 'EXCEPTIONS.FUNDAMENTAL_ALTERATION'
  | 'ANNEXES.OVERVIEW'
  | 'ANNEXES.ACCESSIBILITY_REQUIREMENTS'
  | 'ANNEXES.IMPLEMENTATION_EXAMPLES'
  | 'ANNEXES.BUILT_ENVIRONMENT'
  | 'ANNEXES.DISPROPORTIONATE_BURDEN'
  | 'ANNEXES.CONFORMITY_ASSESSMENT'
  | 'ANNEXES.ASSESSMENT_CRITERIA'

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
    default:
      return null
  }
}
