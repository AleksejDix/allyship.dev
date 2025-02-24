import "@/styles/globals.css"

import { Header } from "@/components/header"
import { Layout } from "@/components/layout"
import { PageConnectorNext } from "@/components/page-connector-next"

export default function SidePanel() {
  return (
    <Layout>
      <PageConnectorNext />
      <Header />
    </Layout>
  )
}
