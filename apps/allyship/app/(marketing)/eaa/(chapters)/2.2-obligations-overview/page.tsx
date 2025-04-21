import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, List } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { INTRODUCTION_LINKS, OBLIGATIONS_LINKS } from '../../constants/links'

export const metadata: Metadata = {
  title: 'Obligations of Economic Operators | European Accessibility Act',
  description:
    'An overview of the legal obligations for manufacturers, importers, distributors and service providers under the European Accessibility Act.',
}

export default function ObligationsPage() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-8 gap-4 lg:gap-12">
      <header className="lg:col-span-3">
        <div className="lg:sticky lg:top-2 text-left lg:text-right">
          <h1 className="text-4xl font-bold mb-[23px]">
            Obligations of Economic Operators.
          </h1>

          <nav aria-labelledby="page-sections-heading">
            <h2 id="page-sections-heading" className="sr-only">
              Page sections.
            </h2>
            <ul className="space-y-1 text-lg">
              <li>
                <a className="underline" href="#overview" id="overview-link">
                  Overview of Obligations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#manufacturers-summary"
                  id="manufacturers-summary-link"
                >
                  Manufacturers: Key Obligations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#importers-summary"
                  id="importers-summary-link"
                >
                  Importers: Key Obligations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#distributors-summary"
                  id="distributors-summary-link"
                >
                  Distributors: Key Obligations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#service-providers-summary"
                  id="service-providers-summary-link"
                >
                  Service Providers: Key Obligations.
                </a>
              </li>
              <li>
                <a
                  className="underline"
                  href="#multiple-roles"
                  id="multiple-roles-link"
                >
                  Multiple Roles.
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div
        className="lg:col-span-5 prose prose-lg dark:prose-invert pb-4 pt-2"
        id="eaa-content"
      >
        <div className="space-y-8">
          <section aria-labelledby="overview">
            <h2
              className="text-2xl font-semibold mb-4 mt-0 scroll-mt-6"
              id="overview"
              tabIndex={-1}
            >
              Overview of Obligations.
            </h2>
            <div className="space-y-4">
              <p>
                The European Accessibility Act sets rules for different
                businesses to make products and services accessible to everyone.
                Each type of business has specific duties based on their role in
                the market.
              </p>
              <p>
                The law defines four types of businesses with different
                responsibilities:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Manufacturers:</strong> Anyone who makes a product or
                  has someone else make it for them, and sells it under their
                  own name or brand.
                </li>
                <li>
                  <strong>Importers:</strong> Anyone in the EU who brings
                  products from outside the EU into the EU market.
                </li>
                <li>
                  <strong>Distributors:</strong> Anyone who sells products to
                  customers after manufacturers or importers have placed them on
                  the market.
                </li>
                <li>
                  <strong>Service Providers:</strong> Anyone who offers services
                  to consumers in the EU.
                </li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="manufacturers-summary">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="manufacturers-summary"
              tabIndex={-1}
            >
              Manufacturers: Key Obligations.
            </h2>
            <div className="space-y-4">
              <p>
                Manufacturers have the main responsibility for making sure
                products meet accessibility requirements. Here are their key
                duties:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Making sure products are designed and made according to
                  accessibility requirements.
                </li>
                <li>Checking that products conform to the rules.</li>
                <li>Creating technical documents about the product.</li>
                <li>Creating the EU declaration of conformity.</li>
                <li>Adding the CE marking to products.</li>
                <li>
                  Making sure all products continue to meet the requirements
                  during production.
                </li>
                <li>
                  Keeping records of complaints and products that don't meet the
                  requirements.
                </li>
                <li>
                  Providing information to prove their products follow the
                  rules.
                </li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.MANUFACTURERS.fullPath}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about manufacturers' obligations →
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="importers-summary">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="importers-summary"
              tabIndex={-1}
            >
              Importers: Key Obligations.
            </h2>
            <div className="space-y-4">
              <p>
                Importers check that products from outside the EU meet
                accessibility requirements before selling them in the EU. Here
                are their main duties:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Checking that manufacturers have properly tested their
                  products.
                </li>
                <li>Making sure the product has the CE marking.</li>
                <li>
                  Checking that all required documents are complete and correct.
                </li>
                <li>Making sure the manufacturer's name is on the product.</li>
                <li>Not selling products that don't meet the requirements.</li>
                <li>Adding their contact information to the product.</li>
                <li>Ensuring products are stored and transported properly.</li>
                <li>Working with authorities who check product safety.</li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.IMPORTERS.fullPath}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about importers' obligations →
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="distributors-summary">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="distributors-summary"
              tabIndex={-1}
            >
              Distributors: Key Obligations.
            </h2>
            <div className="space-y-4">
              <p>
                Distributors sell products after manufacturers or importers have
                put them on the market. Here are their key duties:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Checking that products have the CE marking.</li>
                <li>
                  Making sure products come with necessary documents in the
                  right languages.
                </li>
                <li>
                  Verifying that manufacturers and importers have followed their
                  requirements.
                </li>
                <li>
                  Ensuring storage and transport don't affect product
                  compliance.
                </li>
                <li>
                  Taking action if they find products that don't meet the
                  requirements.
                </li>
                <li>Helping authorities investigate non-compliant products.</li>
                <li>
                  Providing information about product suppliers and customers
                  when needed.
                </li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.DISTRIBUTORS.fullPath}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about distributors' obligations →
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="service-providers-summary">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="service-providers-summary"
              tabIndex={-1}
            >
              Service Providers: Key Obligations.
            </h2>
            <div className="space-y-4">
              <p>
                Service providers offer services covered by the European
                Accessibility Act. Here are their key duties:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Making sure their services meet the accessibility
                  requirements.
                </li>
                <li>
                  Creating and keeping documents that explain how their services
                  meet the requirements.
                </li>
                <li>
                  Informing the public about how their services meet
                  accessibility needs.
                </li>
                <li>
                  Explaining why a service might not fully meet the requirements
                  if they claim an exemption.
                </li>
                <li>
                  Fixing services that don't meet the requirements when told to
                  do so by authorities.
                </li>
                <li>Working with authorities to improve accessibility.</li>
              </ul>
              <p className="mt-4">
                <Link
                  href={OBLIGATIONS_LINKS.SERVICE_PROVIDERS.fullPath}
                  className="text-blue-600 hover:underline"
                >
                  Learn more about service provider obligations →
                </Link>
              </p>
            </div>
          </section>

          <section aria-labelledby="multiple-roles">
            <h2
              className="text-2xl font-semibold mb-4 scroll-mt-6"
              id="multiple-roles"
              tabIndex={-1}
            >
              Multiple Roles.
            </h2>
            <div className="space-y-4">
              <p>
                Sometimes a company may have more than one role under the
                European Accessibility Act. Here's how this works:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  A company can be both a manufacturer and a service provider.
                  For example, a company that makes smartphones (manufacturer)
                  might also offer a mobile app service (service provider).
                </li>
                <li>
                  A company might be an importer for some products and a
                  distributor for others, depending on where the products come
                  from.
                </li>
                <li>
                  When a company has multiple roles, they must follow all the
                  rules for each role.
                </li>
              </ul>
              <p className="mt-4">
                The law applies based on the specific activities a company
                performs, not just on how the company describes itself.
              </p>
            </div>
          </section>

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">
              Detailed Obligations.
            </h2>
            <p>
              Learn more about the specific requirements for each type of
              business:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Link
                href={OBLIGATIONS_LINKS.MANUFACTURERS.fullPath}
                className="block p-4 border rounded-md hover:bg-muted-foreground/5"
              >
                <h3 className="text-lg font-medium flex items-center">
                  <List className="mr-2" size={20} aria-hidden="true" />
                  Manufacturer Obligations.
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Full list of duties for product manufacturers.
                </p>
              </Link>
              <Link
                href={OBLIGATIONS_LINKS.IMPORTERS.fullPath}
                className="block p-4 border rounded-md hover:bg-muted-foreground/5"
              >
                <h3 className="text-lg font-medium flex items-center">
                  <List className="mr-2" size={20} aria-hidden="true" />
                  Importer Obligations.
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Full list of duties for product importers.
                </p>
              </Link>
              <Link
                href={OBLIGATIONS_LINKS.DISTRIBUTORS.fullPath}
                className="block p-4 border rounded-md hover:bg-muted-foreground/5"
              >
                <h3 className="text-lg font-medium flex items-center">
                  <List className="mr-2" size={20} aria-hidden="true" />
                  Distributor Obligations.
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Full list of duties for product distributors.
                </p>
              </Link>
              <Link
                href={OBLIGATIONS_LINKS.SERVICE_PROVIDERS.fullPath}
                className="block p-4 border rounded-md hover:bg-muted-foreground/5"
              >
                <h3 className="text-lg font-medium flex items-center">
                  <List className="mr-2" size={20} aria-hidden="true" />
                  Service Provider Obligations.
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Full list of duties for service providers.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
