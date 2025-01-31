import { Footer } from "@/components/site/Footer"
import { Header } from "@/components/site/Header"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      {/* <div className="container ">
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
        </nav>
      </div> */}
      <main>{children}</main>
      <Footer />
    </>
  )
}
