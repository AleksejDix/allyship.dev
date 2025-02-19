import { PageHeader } from "@/features/websites/components/page-header"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader title="Scans" description={`Scans for`} />
      {children}
    </>
  )
}
