import { AuthProvider } from "@/providers/auth-provider"
import { PageProvider } from "@/providers/page-provider"
import { SpaceProvider } from "@/providers/space-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { UrlProvider } from "@/providers/url-provider"
import { WebsiteProvider } from "@/providers/website-provider"
import type { PropsWithChildren } from "react"

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ally-studio-theme">
      <AuthProvider>
        <UrlProvider>
          <SpaceProvider>
            <WebsiteProvider>
              <PageProvider>{children}</PageProvider>
            </WebsiteProvider>
          </SpaceProvider>
        </UrlProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
