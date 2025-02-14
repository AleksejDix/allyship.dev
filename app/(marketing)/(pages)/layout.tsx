export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container max-w-2xl prose dark:prose-invert py-8">
      {children}
    </div>
  )
}
