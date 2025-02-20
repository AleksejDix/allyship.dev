import { Layout } from "./layout"

export function LoadingState() {
  return (
    <Layout>
      <div className="flex h-screen items-center justify-center">
        <div role="status" className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    </Layout>
  )
}
