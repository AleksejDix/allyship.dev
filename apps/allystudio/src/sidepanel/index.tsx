import "@/styles/globals.css"

import { Header } from "@/components/header"
import { Layout } from "@/components/layout"
import { PageConnector } from "@/components/page-connector"

export default function SidePanel() {
  return (
    <Layout>
      <PageConnector />
      <Header />
    </Layout>
  )
}
