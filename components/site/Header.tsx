import { MainNav } from "@/components/site/MainNav"

export function Header() {
  return (
    <header className="sticky top-0 border-b border-border z-10 bg-background">
      <div className="container flex h-16 w-fulll items-center justify-between ">
        <MainNav />
      </div>
    </header>
  )
}
