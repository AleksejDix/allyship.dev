import { Footer } from "@/components/site/Footer"
import { Header } from "@/components/site/Header"

type RootLayoutProps = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} role="main" aria-label="Main">
        {children}
      </main>
      <Footer />
    </>
  )
}
