import { Page } from "@/components/page/page"
import { Space } from "@/components/space/space"
import { AuthProvider } from "@/providers/auth-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { UrlProvider } from "@/providers/url-provider"
import { WebsiteProvider } from "@/providers/website-provider"
import type { PropsWithChildren } from "react"

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ally-studio-theme">
      <AuthProvider>
        <UrlProvider>
          <Space debug>
            {/* <WebsiteProvider> */}
            {/* <Page debug> */}
            {children}
            {/* </Page> */}
            {/* </WebsiteProvider> */}
          </Space>
        </UrlProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
