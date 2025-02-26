import "@/styles/globals.css"

import { Connector } from "@/components/connector/connector"
import { Layout } from "@/components/layout"
import { Werkzeug } from "@/components/werkzeug"

export default function SidePanel() {
  return (
    <Layout>
      {/* <Connector /> */}
      <Werkzeug />
    </Layout>
  )
}
