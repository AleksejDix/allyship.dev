import React from 'react'

interface ExemptionDiagramProps {
  className?: string
}

export function ExemptionDiagram({ className = '' }: ExemptionDiagramProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-t-lg">
        <h3 className="text-lg font-medium text-center">
          EAA Exemption Assessment
        </h3>
      </div>
      <div className="p-6 bg-white dark:bg-gray-900 rounded-b-lg">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Decision tree chart */}
          <div className="flex flex-col items-center space-y-4">
            {/* Start question */}
            <div className="w-full max-w-xs p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg text-center">
              <p className="font-medium">
                Would accessibility requirements require significant change?
              </p>
            </div>

            {/* First branch */}
            <div className="flex w-full justify-center">
              <div className="flex flex-col items-center w-1/2">
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                  Yes
                </div>
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="w-full max-w-xs p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg text-center">
                  <p className="font-medium">
                    Would it result in disproportionate burden?
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center w-1/2">
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                  No
                </div>
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="w-full max-w-xs p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg text-center">
                  <p className="font-medium">Exemption Not Applicable</p>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    Must comply with EAA
                  </p>
                </div>
              </div>
            </div>

            {/* Second branch */}
            <div className="flex w-full justify-start pl-[12.5%]">
              <div className="flex flex-col items-center w-1/2">
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                  Yes
                </div>
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="w-full max-w-xs p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg text-center">
                  <p className="font-medium">May Qualify for Exemption</p>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    Document assessment in declaration
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center w-1/2">
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded">
                  No
                </div>
                <div className="h-6 border-l border-gray-300 dark:border-gray-700"></div>
                <div className="w-full max-w-xs p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg text-center">
                  <p className="font-medium">Exemption Not Applicable</p>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    Must comply with EAA
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend and explanation */}
          <div className="flex flex-col space-y-4">
            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-medium mb-2">
                Exemption Assessment Factors
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>Size, resources and nature of the business</li>
                <li>
                  Estimated costs and benefits vs potential benefit to persons
                  with disabilities
                </li>
                <li>Frequency and duration of use of the product/service</li>
                <li>Economic operator's lifecycle of the product/service</li>
                <li>Alternatives and existing solutions</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-medium mb-2">
                Documentation Requirements
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                If claiming an exemption, you must:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Perform and document the assessment</li>
                <li>Retain documentation for 5 years</li>
                <li>Re-evaluate when requested by monitoring authority</li>
                <li>Provide documentation when requested</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
