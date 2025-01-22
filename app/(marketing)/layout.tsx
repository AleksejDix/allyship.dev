import { RouterLink } from "@/components/RouterLink"
import { Footer } from "@/components/site/Footer"
import { Logo } from "@/components/site/Logo"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <header className="">
        <div className="container ">
          <RouterLink href="/">
            <Logo />
          </RouterLink>
          <nav
            aria-labelledby="primary-navigation"
            className="inline-flex gap-4 ml-4"
          >
            <span id="primary-navigation" className="sr-only">
              Website
            </span>
            <RouterLink href="/blog" className="font-medium hover:text-primary">
              Blog
            </RouterLink>
            {/* <Link href="/guides" className="font-medium hover:text-primary">
              Guides
            </Link> */}
          </nav>
        </div>
      </header>

      {children}

      <Footer />
    </>
  )
}
