import { MainNav } from "@/components/site/MainNav"

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-background shadow-lg">
      <div className="container flex h-16 w-full items-center justify-between ">
        <MainNav />
      </div>
    </header>
  )
}
