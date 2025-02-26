import "@/styles/globals.css"

import { ElementInspector } from "@/components/element-inspector/element-inspector"
import { Layout } from "@/components/layout"
import { Werkzeug } from "@/components/werkzeug"

export default function SidePanel() {
  return (
    <Layout>
      {/* <Connector /> */}
      <Werkzeug />
      <div className="border-t border-border mt-4 pt-4">
        <ElementInspector />
      </div>
    </Layout>
  )
}
