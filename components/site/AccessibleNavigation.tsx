"use client"

const AccessibleNavigation = () => {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.querySelector("#main")
    if (main instanceof HTMLElement) {
      main.focus()
      main.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      role="navigation"
      aria-label="Skip navigation"
      className="absolute w-full z-50"
    >
      <a
        href="#main"
        onClick={handleSkip}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSkip(e as unknown as React.MouseEvent<HTMLAnchorElement>)
          }
        }}
        className="
          absolute
          left-3
          -translate-y-full
          transition-transform
          focus:translate-y-3
          bg-primary
          text-primary-foreground
          px-4
          py-2
          rounded-md
          shadow-lg
          focus:outline-none
          focus:ring-2
          focus:ring-ring
          focus:ring-offset-2
          hover:bg-primary/90
        "
      >
        Skip to main content
      </a>
    </div>
  )
}

export default AccessibleNavigation
