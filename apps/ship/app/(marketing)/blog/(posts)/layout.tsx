export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container prose dark:prose-invert py-8 xl:grid xl:grid-cols-[1fr_minmax(300px,640px)_1fr] gap-8">
      <div></div>
      {children}
    </div>
  )
}
