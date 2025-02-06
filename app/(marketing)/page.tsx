// import { MoveRight, PhoneCall } from "lucide-react"
import { Faqs } from "@/components/blocks/Faqs"
import { Issues } from "@/components/blocks/Issues"
import { ScanProcess } from "@/components/blocks/ScanProcess"
import { Services } from "@/components/blocks/Services"
import { Stats } from "@/components/blocks/Stats"
import { WebScanner } from "@/components/blocks/WebScanner"
import { Compliance } from "@/components/charts/Compliance"
import { Loader } from "@/components/loader"

// import { NewsletterFormSection } from "@/components/emails/newletter-form-banner"

// import { Button } f rom "@/components/ui/button"

const Page = () => (
  <>
    <div className="container pt-6 md:py-12 space-y-8 relative">
      {/* Tube light effect */}
      <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden">
        <div className="relative w-full h-[400px]">
          {/* Central light beam */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[200px] h-[200px] bg-gradient-to-b from-blue-500/50 to-transparent blur-[100px]" />

          {/* Side glows */}
          <div className="absolute left-1/3 -translate-x-1/2 top-0 w-[150px] h-[150px] bg-gradient-to-b from-purple-500/30 to-transparent blur-[100px]" />
          <div className="absolute right-1/3 translate-x-1/2 top-0 w-[150px] h-[150px] bg-gradient-to-b from-purple-500/30 to-transparent blur-[100px]" />

          {/* Wider ambient glow */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[500px] h-[300px] bg-gradient-to-b from-blue-500/20 to-transparent blur-[120px]" />

          {/* Conical gradients */}
          <div className="absolute left-0 top-0 w-[300px] h-[300px] bg-[conic-gradient(from_0deg_at_75%_50%,transparent_0deg,purple-500_90deg,transparent_180deg)] opacity-20 blur-[60px]" />
          <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-[conic-gradient(from_180deg_at_25%_50%,transparent_0deg,purple-500_90deg,transparent_180deg)] opacity-20 blur-[60px]" />
        </div>
      </div>

      <div className="space-y-4 text-center">
        <div>
          <Loader size={64} />
        </div>
        <h1 className="text-4xl mx-auto font-bold md:text-7xl max-w-2xl text-pretty font-display">
          Master <br /> Web Accessibility
        </h1>
        <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl md:mx-auto">
          Learn web accessibility through interactive guides, videos, and
          articles. Allyship gives you the tools to create inclusive,
          user-friendly websites effortlessly. Let's build the best site
          together!
        </p>
      </div>
    </div>

    <WebScanner />
    <Stats />
    <ScanProcess />
    <Issues />
    <Services />

    <div className="container max-w-screen-xl space-y-8">
      <div className="space-y-4 md:text-center ">
        <h2 className="text-3xl font-bold md:text-5xl max-w-2xl font-display text-pretty text-center mx-auto">
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

export default Page
