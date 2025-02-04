// import { MoveRight, PhoneCall } from "lucide-react"

import { ScanJobCreate } from "@/features/scans/components/scan-create"

import { Faqs } from "@/components/blocks/Faqs"
import { Issues } from "@/components/blocks/Issues"
import { Services } from "@/components/blocks/Services"
import { Stats } from "@/components/blocks/Stats"
import { Compliance } from "@/components/charts/Compliance"

// import { NewsletterFormSection } from "@/components/emails/newletter-form-banner"

// import { Button } f rom "@/components/ui/button"

const Page = () => (
  <>
    <div className="container max-w-2xl py-12 space-y-8 relative">
      <div>
        {/* <Button variant="secondary" size="sm" className="gap-4">
            Read our launch article <MoveRight className="w-4 h-4" />
            </Button> */}
      </div>
      <div className="space-y-4 md:text-center">
        <h1 className="text-4xl font-bold md:text-7xl max-w-2xl tracking-tighter text-pretty">
          Master Web Accessibility
        </h1>
        <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl md:mx-auto">
          Learn web accessibility through interactive guides, videos, and
          articles. Allyship gives you the tools to create inclusive,
          user-friendly websites effortlessly. Let’s build the best site
          together!
        </p>
      </div>
      <ScanJobCreate />
    </div>

    <Stats />
    <Issues />
    <Services />

    <div className="container space-y-8">
      <div className="space-y-4 md:text-center ">
        <h2 className="text-3xl font-bold md:text-5xl max-w-2xl tracking-tighter text-pretty text-center mx-auto">
          Get Started with Allyship
        </h2>
        <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl md:mx-auto">
          Start your journey to web accessibility mastery today. Allyship offers
          a range of services to help you create inclusive digital experiences.
        </p>
      </div>
      <Compliance />
    </div>

    <Faqs />

    {/* <NewsletterFormSection /> */}
    {/* <div className="flex flex-row gap-3">
          <Button size="lg" className="gap-4" variant="outline">
            Jump on a call <PhoneCall className="w-4 h-4" />
          </Button>
          <Button size="lg" className="gap-4">
            Sign up here <MoveRight className="w-4 h-4" />
          </Button>
        </div> */}
  </>
)

export default Page
