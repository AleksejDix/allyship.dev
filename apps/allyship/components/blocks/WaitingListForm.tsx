'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Card, CardContent } from '@workspace/ui/components/card'
import { BrowserWindow } from '@/components/BrowserWindow'
import { waitingListAction } from '@/components/emails/waiting-list-action'

function SuccessMessage() {
  return (
    <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle
            className="h-5 w-5 text-green-500 dark:text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
            Thank you for your interest!
          </h3>
          <div className="mt-2 text-sm text-green-700 dark:text-green-300">
            <p>
              We've received your email and will notify you when our product
              becomes available. Please check your inbox for a confirmation
              email.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Generic waiting list form component for product launches.
 * Collects email addresses and submits them to the subscribe API.
 */
interface WaitingListFormProps {
  /** The campaign identifier used for tracking and segmentation */
  campaign: string
  /** The title displayed in the form */
  title: string
  /** The description text */
  description: string
  /** Optional preview content to display next to the form */
  preview?: React.ReactNode
}

// Client component that handles the search params
function FormWithSearchParams({
  campaign,
  title,
  description,
  preview,
}: WaitingListFormProps) {
  const searchParams = useSearchParams()
  const showSuccess = searchParams.get('success') === 'true'

  return (
    <FormContent
      campaign={campaign}
      title={title}
      description={description}
      preview={preview}
      initialShowSuccess={showSuccess}
    />
  )
}

// Form content that doesn't directly use useSearchParams
function FormContent({
  campaign,
  title,
  description,
  preview,
  initialShowSuccess,
}: WaitingListFormProps & { initialShowSuccess: boolean }) {
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(initialShowSuccess)

  async function handleSubmit(formData: FormData) {
    setSubmitting(true)

    const email = formData.get('email') as string

    try {
      const [result, formError] = await waitingListAction({
        email,
        campaign,
      })

      if (formError) {
        console.error('Validation error:', formError)
      } else if (result && result.success) {
        setShowSuccessMessage(true)
      } else if (result && !result.success) {
        console.error('Subscription failed:', result.error)
      }
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {showSuccessMessage && <SuccessMessage />}
      <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold font-display">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
              <form action={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    required
                    className="w-full px-3 py-2 text-sm rounded-md border bg-background/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Join Waiting List'}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
            </div>
            <div className="hidden md:block">
              {preview || (
                <BrowserWindow url="allyship.dev">
                  <div className="p-4 flex items-center justify-center aspect-video">
                    <div className="text-center space-y-4">
                      <Badge variant="outline" className="mx-auto">
                        Coming Soon
                      </Badge>
                      <div className="text-lg font-semibold">New Product</div>
                      <div className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Be the first to know when our new product launches
                      </div>
                    </div>
                  </div>
                </BrowserWindow>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Wrapper with suspense boundary for useSearchParams
function WaitingListFormWrapper(props: WaitingListFormProps) {
  return (
    <Suspense
      fallback={
        <Card className="border border-border/40 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-8 flex items-center justify-center min-h-[200px]">
            <div className="text-center text-muted-foreground">Loading...</div>
          </CardContent>
        </Card>
      }
    >
      <FormWithSearchParams {...props} />
    </Suspense>
  )
}

// Export the component with proper suspense handling
export function WaitingListForm(props: WaitingListFormProps) {
  return <WaitingListFormWrapper {...props} />
}

/**
 * Specific implementation of WaitingListForm for the White Label WCAG & EAA Compliance Audits product.
 */
export function WhiteLabelLeadForm() {
  return (
    <WaitingListForm
      campaign="white-label-wcag-audits"
      title="Get Early Access to White Label EAA Compliance Reports"
      description="Our product is currently in development. Leave your email to be the first to know when we launch and receive an exclusive discount."
      preview={
        <BrowserWindow url="youragency.com">
          <div className="p-4 flex items-center justify-center aspect-video">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="mx-auto">
                Coming Soon
              </Badge>
              <div className="text-lg font-semibold">
                White Label WCAG & EAA Audits
              </div>
              <div className="text-sm text-muted-foreground max-w-xs mx-auto">
                Be the first to offer European Accessibility Act compliance
                reports to your clients
              </div>
            </div>
          </div>
        </BrowserWindow>
      }
    />
  )
}
