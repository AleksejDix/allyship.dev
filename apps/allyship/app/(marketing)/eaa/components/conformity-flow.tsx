import React from 'react'

interface ConformityFlowProps {
  className?: string
}

export function ConformityFlow({ className = '' }: ConformityFlowProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-t-lg">
        <h3 className="text-lg font-medium text-center">
          Conformity Assessment Process
        </h3>
      </div>
      <div className="p-6 flex flex-col items-center space-y-4 bg-white dark:bg-gray-900 rounded-b-lg">
        {/* Step 1 */}
        <div className="w-full max-w-md p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg text-center">
          <p className="font-medium">Step 1: Product Design & Development</p>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Incorporate accessibility requirements from design phase
          </p>
        </div>

        {/* Arrow */}
        <div className="w-8 h-8 flex justify-center items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M12 5L12 19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Step 2 */}
        <div className="w-full max-w-md p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg text-center">
          <p className="font-medium">Step 2: Internal Production Control</p>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Ensure manufacturing process maintains accessibility features
          </p>
        </div>

        {/* Arrow */}
        <div className="w-8 h-8 flex justify-center items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M12 5L12 19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Step 3 */}
        <div className="w-full max-w-md p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg text-center">
          <p className="font-medium">Step 3: Technical Documentation</p>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Prepare comprehensive documentation of accessibility features
          </p>
        </div>

        {/* Arrow */}
        <div className="w-8 h-8 flex justify-center items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M12 5L12 19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Step 4 */}
        <div className="w-full max-w-md p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 rounded-lg text-center">
          <p className="font-medium">Step 4: EU Declaration of Conformity</p>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Draw up formal declaration of compliance with EAA
          </p>
        </div>

        {/* Arrow */}
        <div className="w-8 h-8 flex justify-center items-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <path
              d="M12 5L12 19M12 19L19 12M12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Step 5 */}
        <div className="w-full max-w-md p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg text-center">
          <p className="font-medium">Step 5: CE Marking Application</p>
          <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
            Apply CE marking and release product to market
          </p>
        </div>
      </div>
    </div>
  )
}
