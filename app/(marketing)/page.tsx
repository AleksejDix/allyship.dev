// import { MoveRight, PhoneCall } from "lucide-react"

import { Faqs } from "@/components/blocks/Faqs"
import { Services } from "@/components/blocks/Services"

// import { NewsletterFormSection } from "@/components/emails/newletter-form-banner"

// import { Button } f rom "@/components/ui/button"

const Page = () => (
  <main className=" md:py-20 lg:py-40">
    <div className="container max-w-2xl">
      <div>
        {/* <Button variant="secondary" size="sm" className="gap-4">
            Read our launch article <MoveRight className="w-4 h-4" />
            </Button> */}
      </div>
      <div className="space-y-4 md:text-center">
        <h1 className="text-4xl font-bold md:text-7xl max-w-2xl tracking-tighter text-pretty">
          Master Web Accessibility with Allyship
        </h1>
        <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl md:mx-auto">
          Learn web accessibility through interactive guides, videos, and
          articles. Allyship gives you the tools to create inclusive,
          user-friendly websites effortlessly. Let’s build the best site
          together!
        </p>
      </div>
    </div>
    <Services />
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
  </main>
)

export default Page
