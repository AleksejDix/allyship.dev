import * as React from "react"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserMenu } from "@/components/auth/UserMenu"

import { RouterLink } from "../RouterLink"
import { Logo } from "./Logo"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Blog",
    href: "/blog",
    description:
      "A blog about accessibility, quality assurance, and automated testing.",
  },
  {
    title: "Glossary",
    href: "/glossary",
    description:
      "A glossary of accessibility terms and definitions for the web.",
  },
  {
    title: "Accessibility Standards Matrix",
    href: "/education/accessibility-standards-matrix",
    description:
      "Compare accessibility criteria between different standards and guidelines.",
  },
  {
    title: "Accessibility Checklist",
    href: "/education/checklist",
    description: "A checklist of accessibility criteria",
  },
  {
    title: "Accessibility Training",
    href: "/education/courses",
    description: "A training program for accessibility",
  },
  // {
  //   title: "Accessibility Resources",
  //   href: "/education/resources",
  //   description: "A list of resources for accessibility",
  // },
]

const products = [
  {
    title: "Automated Accessibility Scanning",
    href: "/products/automated-accessibility-scanning",
    description: "Scan your website for accessibility issues",
  },
  {
    title: "Manual Accessibility Audits",
    href: "/products/manual-accessibility-audit",
    description: "A manual accessibility audit of your website",
  },
  {
    title: "Tab Order Bookmarklet",
    href: "/products/focus-bookmarklet",
    description: "A bookmarklet to help you understand tab order",
  },
  {
    title: "Heading Order Bookmarklet",
    href: "/products/heading-order-bookmarklet",
    description: "A bookmarklet to help you understand heading order",
  },
]

export function MainNav() {
  return (
    <>
      <div className="flex flex-row gap-2">
        <Logo />
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {products.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Education</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex flex-row gap-2">
        <UserMenu />

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <Button variant="ghost" size="icon" asChild>
              <SheetTrigger aria-label="Toggle menu">
                <Menu aria-hidden="true" className="w-6 h-6" />
              </SheetTrigger>
            </Button>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                <RouterLink
                  href="/services"
                  className="font-medium hover:text-primary"
                >
                  Services
                </RouterLink>

                <RouterLink
                  href="/blog"
                  className="font-medium hover:text-primary"
                >
                  Blog
                </RouterLink>

                <RouterLink
                  href="/education/courses"
                  className="font-medium hover:text-primary"
                >
                  Courses
                </RouterLink>

                <RouterLink
                  href="/education/checklist"
                  className="font-medium hover:text-primary"
                >
                  Checklist
                </RouterLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
