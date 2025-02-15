// import { MoveRight, PhoneCall } from "lucide-react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Faqs } from "@/components/blocks/Faqs"
import { Issues } from "@/components/blocks/Issues"
import { ScanProcess } from "@/components/blocks/ScanProcess"
import { Services } from "@/components/blocks/Services"
import { Stats } from "@/components/blocks/Stats"
import { WebScanner } from "@/components/blocks/WebScanner"
import { Compliance } from "@/components/charts/Compliance"
import { Loader } from "@/components/loader"

// import { NewsletterFormSection } from "@/components/emails/newletter-form-banner"
// import { Button } from "@/components/ui/button"

const Page = async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <div className="container pt-6 md:py-12 space-y-8 relative">
        <div className="space-y-4 text-center">
          <div>
            <Loader size={64} />
          </div>
          <h1 className="text-4xl mx-auto font-bold md:text-7xl max-w-2xl text-pretty font-display">
            Master <br /> Web Accessibility
          </h1>
          <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl mx-auto">
            Scan, identify, and fix accessibility issues with AllyStudio. Make
            your website work for everyone.
          </p>
          {!user ? (
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/spaces">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          )}
          <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl md:mx-auto">
            Join organizations that trust Allyship to enhance their digital
            accessibility. Our comprehensive tools and guidance make compliance
            straightforward and achievable.
          </p>
        </div>
      </div>

      <WebScanner />
      <Stats />
      <ScanProcess />
      <Issues />
      <Services />

      <div className="container space-y-8">
        <div className="space-y-4 md:text-center">
          <h2 className="text-3xl font-bold md:text-5xl max-w-2xl font-display text-pretty text-center mx-auto">
            Get Started with Allyship
          </h2>
          <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl md:mx-auto">
            Start your journey to web accessibility mastery today. Allyship
            offers a range of services to help you create inclusive digital
            experiences.
          </p>
        </div>
        <Compliance />
      </div>

      <Faqs />

      {/* <NewsletterFormSection />
      <div className="flex flex-row gap-3">
        <Button size="lg" className="gap-4" variant="outline">
          Jump on a call <PhoneCall className="w-4 h-4" />
        </Button>
        <Button size="lg" className="gap-4">
          Sign up here <MoveRight className="w-4 h-4" />
        </Button>
      </div> */}
    </>
  )
}

export default Page
