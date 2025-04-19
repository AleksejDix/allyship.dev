import Link from 'next/link'
import {
  INTRODUCTION_LINKS,
  REQUIREMENTS_LINKS,
  OBLIGATIONS_LINKS,
  COMPLIANCE_LINKS,
  EXCEPTIONS_LINKS,
  ANNEXES_LINKS,
  IMPLEMENTATION_LINKS,
} from '../constants/links'

export function TableOfContent() {
  return (
    <>
      {/* Chapter 1: Introduction */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-sm font-medium tracking-widest uppercase">
            Chapter 1
          </h2>
          <h3 className="text-2xl font-semibold mt-2">
            <Link
              href={INTRODUCTION_LINKS.OVERVIEW.fullPath}
              className="hover:text-blue-600"
            >
              Introduction
            </Link>
          </h3>
        </div>

        <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
          <li>
            <Link
              href={INTRODUCTION_LINKS.PURPOSE_AND_DEFINITIONS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {INTRODUCTION_LINKS.PURPOSE_AND_DEFINITIONS.label}
            </Link>
          </li>
          <li>
            <Link
              href={INTRODUCTION_LINKS.SCOPE.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {INTRODUCTION_LINKS.SCOPE.label}
            </Link>
          </li>
          <li>
            <Link
              href={INTRODUCTION_LINKS.EXISTING_LAW.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {INTRODUCTION_LINKS.EXISTING_LAW.label}
            </Link>
          </li>
          <li>
            <Link
              href={INTRODUCTION_LINKS.FREE_MOVEMENT.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {INTRODUCTION_LINKS.FREE_MOVEMENT.label}
            </Link>
          </li>
        </ul>
      </section>

      <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

      {/* Chapter 2: Requirements & Obligations */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-sm font-medium tracking-widest uppercase">
            Chapter 2
          </h2>
          <h3 className="text-2xl font-semibold mt-2">
            <Link
              href={REQUIREMENTS_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
              className="hover:text-blue-600"
            >
              Requirements & Obligations
            </Link>
          </h3>
        </div>

        <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
          <li>
            <Link
              href={REQUIREMENTS_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {REQUIREMENTS_LINKS.ACCESSIBILITY_REQUIREMENTS.label}
            </Link>
          </li>
          <li>
            <Link
              href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {OBLIGATIONS_LINKS.OVERVIEW.label}
            </Link>
          </li>
          <li>
            <Link
              href={OBLIGATIONS_LINKS.MANUFACTURERS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {OBLIGATIONS_LINKS.MANUFACTURERS.label}
            </Link>
          </li>
          <li>
            <Link
              href={OBLIGATIONS_LINKS.IMPORTERS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {OBLIGATIONS_LINKS.IMPORTERS.label}
            </Link>
          </li>
          <li>
            <Link
              href={OBLIGATIONS_LINKS.DISTRIBUTORS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {OBLIGATIONS_LINKS.DISTRIBUTORS.label}
            </Link>
          </li>
          <li>
            <Link
              href={OBLIGATIONS_LINKS.SERVICE_PROVIDERS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {OBLIGATIONS_LINKS.SERVICE_PROVIDERS.label}
            </Link>
          </li>
        </ul>
      </section>

      <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

      {/* Chapter 3: Compliance & Exceptions */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-sm font-medium tracking-widest uppercase">
            Chapter 3
          </h2>
          <h3 className="text-2xl font-semibold mt-2">
            <Link
              href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
              className="hover:text-blue-600"
            >
              Compliance & Exceptions
            </Link>
          </h3>
        </div>

        <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
          <li>
            <Link
              href={COMPLIANCE_LINKS.CONFORMITY.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {COMPLIANCE_LINKS.CONFORMITY.label}
            </Link>
          </li>
          <li>
            <Link
              href={COMPLIANCE_LINKS.EU_DECLARATION.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {COMPLIANCE_LINKS.EU_DECLARATION.label}
            </Link>
          </li>
          <li>
            <Link
              href={COMPLIANCE_LINKS.CE_MARKING.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {COMPLIANCE_LINKS.CE_MARKING.label}
            </Link>
          </li>
          <li>
            <Link
              href={COMPLIANCE_LINKS.MARKET_SURVEILLANCE.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {COMPLIANCE_LINKS.MARKET_SURVEILLANCE.label}
            </Link>
          </li>
          <li>
            <Link
              href={COMPLIANCE_LINKS.SERVICE_COMPLIANCE.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {COMPLIANCE_LINKS.SERVICE_COMPLIANCE.label}
            </Link>
          </li>
          <li>
            <Link
              href={COMPLIANCE_LINKS.NON_COMPLIANCE.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {COMPLIANCE_LINKS.NON_COMPLIANCE.label}
            </Link>
          </li>
          <li>
            <Link
              href={COMPLIANCE_LINKS.HARMONIZED_STANDARDS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {COMPLIANCE_LINKS.HARMONIZED_STANDARDS.label}
            </Link>
          </li>
          <li>
            <Link
              href={EXCEPTIONS_LINKS.FUNDAMENTAL_ALTERATION.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {EXCEPTIONS_LINKS.FUNDAMENTAL_ALTERATION.label}
            </Link>
          </li>
        </ul>
      </section>

      <div className="my-8 border-t border-gray-200" aria-hidden="true"></div>

      {/* Chapter 4: Annexes */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-sm font-medium tracking-widest uppercase">
            Chapter 4
          </h2>
          <h3 className="text-2xl font-semibold mt-2">
            <Link
              href={ANNEXES_LINKS.OVERVIEW.fullPath}
              className="hover:text-blue-600"
            >
              Annexes
            </Link>
          </h3>
        </div>

        <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
          <li>
            <Link
              href={ANNEXES_LINKS.OVERVIEW.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {ANNEXES_LINKS.OVERVIEW.label}
            </Link>
          </li>
          <li>
            <Link
              href={ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {ANNEXES_LINKS.ACCESSIBILITY_REQUIREMENTS.label}
            </Link>
          </li>
          <li>
            <Link
              href={ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {ANNEXES_LINKS.IMPLEMENTATION_EXAMPLES.label}
            </Link>
          </li>
          <li>
            <Link
              href={ANNEXES_LINKS.BUILT_ENVIRONMENT.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {ANNEXES_LINKS.BUILT_ENVIRONMENT.label}
            </Link>
          </li>
          <li>
            <Link
              href={ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {ANNEXES_LINKS.DISPROPORTIONATE_BURDEN.label}
            </Link>
          </li>
          <li>
            <Link
              href={ANNEXES_LINKS.CONFORMITY_ASSESSMENT.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {ANNEXES_LINKS.CONFORMITY_ASSESSMENT.label}
            </Link>
          </li>
          <li>
            <Link
              href={ANNEXES_LINKS.ASSESSMENT_CRITERIA.fullPath}
              className="text-lg hover:text-blue-600"
            >
              {ANNEXES_LINKS.ASSESSMENT_CRITERIA.label}
            </Link>
          </li>
        </ul>
      </section>

      {/* Implementation section could be included if needed, currently not in folder structure */}
      {IMPLEMENTATION_LINKS && Object.keys(IMPLEMENTATION_LINKS).length > 0 && (
        <>
          <div
            className="my-8 border-t border-gray-200"
            aria-hidden="true"
          ></div>
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-sm font-medium tracking-widest uppercase">
                Chapter 5
              </h2>
              <h3 className="text-2xl font-semibold mt-2">
                <Link
                  href={IMPLEMENTATION_LINKS.IMPLEMENTATION?.fullPath || '#'}
                  className="hover:text-blue-600"
                >
                  Implementation
                </Link>
              </h3>
            </div>

            <ul className="space-y-2 mb-6 pl-2 border-l-2 border-slate-200 list-none">
              {Object.values(IMPLEMENTATION_LINKS).map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.fullPath}
                    className="text-lg hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  )
}
