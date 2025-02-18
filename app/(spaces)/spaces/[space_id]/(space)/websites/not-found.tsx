export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">
        No Websites Found
      </h2>
      <p className="mt-2 text-muted-foreground">
        You don&apos;t have any websites yet. Create your first one to get
        started.
      </p>
    </div>
  )
}
