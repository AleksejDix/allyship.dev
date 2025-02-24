import { AuthProvider } from "@/providers/auth-provider"
import { PageProvider } from "@/providers/page-provider"
import { SpaceProvider } from "@/providers/space-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { UrlProvider } from "@/providers/url-provider"
import { WebsiteProvider } from "@/providers/website-provider"
import type { PropsWithChildren } from "react"

import { PagesList } from "./pages-list"

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ally-studio-theme">
      <AuthProvider>
        <UrlProvider>
          <SpaceProvider>
            <WebsiteProvider>
              <PageProvider>
                <div className="flex h-full flex-col">
                  {children}
                  <PagesList />
                </div>
              </PageProvider>
            </WebsiteProvider>
          </SpaceProvider>
        </UrlProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
