import { RouterLink } from "../RouterLink"
import { Logo } from "./Logo"

export function MainNav() {
  return (
    <nav aria-labelledby="main-nav" className="flex  gap-4 items-center">
      <span id="main-nav" className="sr-only">
        Main
      </span>

      <RouterLink href="/">
        <Logo />
      </RouterLink>
      {/*
      <RouterLink href="/services" className="font-medium hover:text-primary">
        Services
      </RouterLink> */}

      <RouterLink href="/blog" className="font-medium hover:text-primary">
        Blog
      </RouterLink>
    </nav>
  )
}
