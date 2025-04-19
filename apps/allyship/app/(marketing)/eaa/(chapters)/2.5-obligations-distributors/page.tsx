import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List, ExternalLink } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import {
  INTRODUCTION_LINKS,
  OBLIGATIONS_LINKS,
  COMPLIANCE_LINKS,
  EXTERNAL_LINKS,
} from '../../constants/links'

export const metadata: Metadata = {
  title: 'Distributor Obligations | European Accessibility Act',
  description:
    'Legal responsibilities of distributors under the European Accessibility Act, including product verification, storage requirements, and actions required for non-compliant products.',
}

export default function DistributorsObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations of Distributors
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a
                  className="underline"
                  href="#role-distributors"
                  id="role-distributors-link"
                >
                  Role of Distributors
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#due-diligence"
                  id="due-diligence-link"
                >
                  Due Diligence
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#non-compliance-action"
                  id="non-compliance-link"
                >
                  Non-Compliance
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#storage-transport"
                  id="storage-transport-link"
                >
                  Storage & Transport
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#corrective-measures"
                  id="corrective-measures-link"
                >
                  Corrective Measures
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#cooperation"
                  id="cooperation-link"
                >
                  Cooperation
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#manufacturer-obligations"
                  id="manufacturer-obligations-link"
                >
                  Acting as Manufacturers
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#accessible-information"
                  id="accessible-information-link"
                >
                  Accessible Information
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2">
        <div className="space-y-8">
          <section aria-labelledby="role-distributors">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="role-distributors"
              tabIndex={-1}
            >
              Role of Distributors
            </h2>
            <div className="space-y-4">
              <p>
                Article 9 of the European Accessibility Act outlines the
                obligations of distributors. Distributors are any natural or
                legal person in the supply chain, other than the manufacturer or
                the importer, who makes a product available on the market.
              </p>
              <p>
                As the economic operators who often have direct contact with
                consumers, distributors play an important role in ensuring that
                only compliant products reach end-users. Their obligations focus
                on verification and due diligence in the handling of products.
              </p>

              <div className="bg-blue-50 border border-blue-400 px-6 text-blue-800 dark:text-blue-400 dark:bg-blue-950 py-4 rounded-md mt-4">
                <h3 className="font-semibold mb-2 mt-0">Related Resources:</h3>
                <p>
                  For a comprehensive overview of all economic operators' roles
                  and responsibilities:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <Link
                      href={OBLIGATIONS_LINKS.OVERVIEW.fullPath}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                      id="overview-link"
                    >
                      Overview of Economic Operators' Obligations
                    </Link>
                  </li>
                  <li>
                    <a
                      href={EXTERNAL_LINKS.OFFICIAL_EAA_TEXT}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      id="official-text-link"
                    >
                      <span>Official EAA Text (Article 9)</span>
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="due-diligence">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="due-diligence"
              tabIndex={-1}
            >
              Due Diligence Requirements
            </h2>
            <div className="space-y-4">
              <p>
                When making a product available on the market, distributors
                shall act with due care in relation to the requirements of this
                Directive. Before making a product available on the market,
                distributors shall verify that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  The product bears the CE marking (
                  <Link
                    href={COMPLIANCE_LINKS.CE_MARKING.fullPath}
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
                    id="ce-marking-link"
                  >
                    learn more about CE marking
                  </Link>
                  )
                </li>
                <li>The product is accompanied by the required documents</li>
                <li>
                  The product is accompanied by instructions and safety
                  information in a language which can be easily understood by
                  consumers and other end-users in the Member State in which the
                  product is to be made available
                </li>
                <li>
                  The manufacturer and the importer have complied with the
                  requirements related to identification and contact information
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="non-compliance-action">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="non-compliance-action"
              tabIndex={-1}
            >
              Action on Non-Compliance
            </h2>
            <div className="space-y-4">
              <p>
                Where a distributor considers or has reason to believe that a
                product is not in conformity with the applicable accessibility
                requirements, the distributor shall:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Not make the product available on the market until it has been
                  brought into conformity
                </li>
                <li>
                  Inform the manufacturer or the importer, as well as the market
                  surveillance authorities, when the product presents a risk
                  related to accessibility
                </li>
              </ul>

              <p className="mt-4">
                For detailed information on handling non-compliant products, see
                <Link
                  href={COMPLIANCE_LINKS.NON_COMPLIANCE.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  id="non-compliance-procedures-link"
                >
                  the non-compliance procedures page
                </Link>
                .
              </p>
            </div>
          </section>

          <section aria-labelledby="storage-transport">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="storage-transport"
              tabIndex={-1}
            >
              Storage and Transport Conditions
            </h2>
            <div className="space-y-4">
              <p>
                Distributors shall ensure that, while a product is under their
                responsibility, storage or transport conditions do not
                jeopardize its compliance with the applicable accessibility
                requirements.
              </p>
              <p>This requires distributors to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Maintain appropriate environmental conditions in storage
                  facilities
                </li>
                <li>
                  Handle products carefully to prevent damage to accessibility
                  features
                </li>
                <li>Ensure proper packaging during transport</li>
                <li>Monitor storage conditions regularly</li>
                <li>Train staff in proper handling procedures</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="corrective-measures">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="corrective-measures"
              tabIndex={-1}
            >
              Corrective Measures
            </h2>
            <div className="space-y-4">
              <p>
                Distributors who consider or have reason to believe that a
                product which they have made available on the market is not in
                conformity with this Directive shall:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Make sure that the corrective measures necessary to bring that
                  product into conformity are taken
                </li>
                <li>Withdraw the product from the market, if appropriate</li>
                <li>Recall the product, if appropriate</li>
              </ul>
              <p>
                Furthermore, where the product presents a risk related to
                accessibility, distributors shall immediately inform the
                competent national authorities of the Member States in which
                they made the product available on the market, giving details,
                in particular, of:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The non-compliance</li>
                <li>Any corrective measures taken</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="cooperation">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="cooperation"
              tabIndex={-1}
            >
              Cooperation with Authorities
            </h2>
            <div className="space-y-4">
              <p>
                Distributors shall, further to a reasoned request from a
                competent national authority, provide it with all the
                information and documentation necessary to demonstrate the
                conformity of a product.
              </p>
              <p>
                They shall cooperate with that authority, at its request, on any
                action taken to eliminate the non-compliance with the applicable
                accessibility requirements of products which they have made
                available on the market.
              </p>
              <p>This cooperation may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing access to product documentation</li>
                <li>Facilitating contact with manufacturers and importers</li>
                <li>Assisting with product recalls or withdrawals</li>
                <li>Providing information on the supply chain</li>
                <li>Supporting market surveillance activities</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="manufacturer-obligations">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="manufacturer-obligations"
              tabIndex={-1}
            >
              Distributors as Manufacturers
            </h2>
            <div className="space-y-4">
              <p>
                In certain circumstances, distributors may be considered
                manufacturers for the purposes of this Directive and shall be
                subject to the obligations of the manufacturer. This occurs when
                a distributor:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Places a product on the market under their own name or
                  trademark
                </li>
                <li>
                  Modifies a product already placed on the market in such a way
                  that compliance with the requirements of this Directive may be
                  affected
                </li>
              </ul>
              <p>
                In such cases, the distributor assumes all the more extensive
                obligations of manufacturers regarding design, conformity
                assessment, technical documentation, and CE marking.
              </p>

              <p className="mt-4">
                For a detailed overview of these additional obligations, see
                <Link
                  href={OBLIGATIONS_LINKS.MANUFACTURERS.fullPath}
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                  id="manufacturers-obligations-link"
                >
                  the manufacturers' obligations page
                </Link>
                .
              </p>
            </div>
          </section>

          <section aria-labelledby="accessible-information">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="accessible-information"
              tabIndex={-1}
            >
              Providing Accessible Information
            </h2>
            <div className="space-y-4">
              <p>
                As the point of contact with end-users, distributors have a
                particular responsibility to ensure that consumers can access
                information about the accessibility features of products. This
                includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Making sure product instructions are available in accessible
                  formats
                </li>
                <li>
                  Providing information about how to use accessibility features
                </li>
                <li>
                  Ensuring staff are knowledgeable about accessibility features
                </li>
                <li>Responding to customer queries about accessibility</li>
              </ul>
            </div>
          </section>

          <footer>
            <nav
              className="flex justify-end items-center mt-10 pt-4 border-t"
              aria-labelledby="footer-nav-heading"
            >
              <h2 id="footer-nav-heading" className="sr-only">
                Chapter navigation
              </h2>

              <Button asChild id="next-chapter-button">
                <Link
                  href={OBLIGATIONS_LINKS.SERVICE_PROVIDERS.fullPath}
                  className="no-underline"
                  aria-labelledby="next-chapter-label"
                >
                  <span id="next-chapter-label">
                    Service Providers' Obligations
                  </span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Button>
            </nav>
          </footer>
        </div>
      </div>
    </section>
  )
}
