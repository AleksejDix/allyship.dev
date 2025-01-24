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
      <main>{children}</main>
      <Footer />
    </>
  )
}
