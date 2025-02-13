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
      <main
        id="main"
        tabIndex={-1}
        role="main"
        aria-label="Main"
        className="relative"
      >
        <div className="light-effect -z-10 -translate-y-1/2">
          <div className="gradient gradient-left"></div>
          <div className="gradient gradient-right mirror"></div>
        </div>
        {children}
      </main>
      <Footer />
    </>
  )
}
