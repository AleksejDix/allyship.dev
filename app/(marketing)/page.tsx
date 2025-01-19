// import { MoveRight, PhoneCall } from "lucide-react"

// import { Button } f rom "@/components/ui/button"

const Page = () => (
  <div>
    <div className="container mx-auto">
      <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
        <div>
          {/* <Button variant="secondary" size="sm" className="gap-4">
            Read our launch article <MoveRight className="w-4 h-4" />
          </Button> */}
        </div>
        <div className="flex gap-4 flex-col">
          <h1 className="font-bold md:text-7xl max-w-2xl tracking-tighter text-center text-pretty">
            Master Web Accessibility with Allyship
          </h1>
          <p className="text-pretty text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-xl mx-auto text-center">
            Learn web accessibility through interactive guides, videos, and
            articles. Allyship gives you the tools to create inclusive,
            user-friendly websites effortlessly. Let’s build the best site
            together!
          </p>
        </div>
        {/* <div className="flex flex-row gap-3">
          <Button size="lg" className="gap-4" variant="outline">
            Jump on a call <PhoneCall className="w-4 h-4" />
          </Button>
          <Button size="lg" className="gap-4">
            Sign up here <MoveRight className="w-4 h-4" />
          </Button>
        </div> */}
      </div>
    </div>
  </div>
)

export default Page
