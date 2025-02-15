import * as React from "react"
import Link from "next/link"
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

const MENU_SETTINGS = {
  products: {
    label: "Products",
    items: [
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
        title: "Field Labels Bookmarklet",
        href: "/products/field-label-bookmarklet",
        description: "A bookmarklet to help you check form field labels",
      },
      {
        title: "Focus Bookmarklet",
        href: "/products/focus-bookmarklet",
        description: "A bookmarklet to help you understand tab order",
      },
      {
        title: "Heading Order Bookmarklet",
        href: "/products/heading-order-bookmarklet",
        description: "A bookmarklet to help you understand heading order",
      },
      {
        title: "Focus Styles Bookmarklet",
        href: "/products/focus-styles-bookmarklet",
        description: "A bookmarklet to help you check focus indicators",
      },
    ],
  },
  education: {
    label: "Education",
    items: [
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
    ],
  },
} as const

export function MainNav() {
  return (
    <>
      <div className="flex flex-row gap-2">
        <Logo />
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            {Object.entries(MENU_SETTINGS).map(([key, menu]) => {
              if (key === "mobile") return null
              return (
                <NavigationMenuItem key={key}>
                  <NavigationMenuTrigger>{menu.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {menu.items.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex flex-row gap-2">
        <UserMenu />

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <Button
              variant="secondary"
              className="rounded-full"
              size="icon"
              asChild
            >
              <SheetTrigger aria-label="Toggle menu">
                <Menu aria-hidden="true" className="w-6 h-6" />
              </SheetTrigger>
            </Button>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {Object.entries(MENU_SETTINGS).map(([key, menu]) => (
                  <div key={key} className="flex flex-col gap-2">
                    <div className="font-medium text-lg">{menu.label}</div>
                    {menu.items.map((item) => (
                      <RouterLink
                        key={item.href}
                        href={item.href}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {item.title}
                      </RouterLink>
                    ))}
                  </div>
                ))}
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
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-offset-background  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
