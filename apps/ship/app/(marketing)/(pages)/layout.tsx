export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      <article className="prose max-w-prose mx-auto dark:prose-invert py-8">
        {children}
      </article>
    </div>
  )
}
