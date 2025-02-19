interface PageHeaderProps {
  heading: string
  description?: string
}

export function PageHeader({ heading, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 py-6">
      <h1 className="text-3xl font-bold leading-tight font-display md:text-6xl lg:leading-[1.1] text-balance">
        {heading}
      </h1>
      {description && (
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-balance">
          {description}
        </p>
      )}
    </div>
  )
}
