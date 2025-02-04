"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { RouterLink } from "../RouterLink"
import { Logo } from "./Logo"

export function MainNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <nav aria-labelledby="main-nav" className="flex gap-4 items-center  w-full">
      <span id="main-nav" className="sr-only">
        Main
      </span>

      <Logo />

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4">
        <RouterLink href="/services" className="font-medium hover:text-primary">
          Services
        </RouterLink>

        <RouterLink href="/blog" className="font-medium hover:text-primary">
          Blog
        </RouterLink>

        <RouterLink href="/courses" className="font-medium hover:text-primary">
          Courses
        </RouterLink>
      </div>

      {/* Mobile Menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="md:hidden p-2" aria-label="Toggle menu">
          <Menu className="w-6 h-6" />
        </SheetTrigger>
        <SheetContent>
          <div className="flex flex-col gap-4 mt-8">
            <RouterLink
              href="/services"
              className="font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Services
            </RouterLink>

            <RouterLink
              href="/blog"
              className="font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Blog
            </RouterLink>

            <RouterLink
              href="/courses"
              className="font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Courses
            </RouterLink>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}
