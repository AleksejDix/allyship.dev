import { Page } from "@/components/page/page"
import { Space } from "@/components/space/space"
import { Website } from "@/components/website/website"
import { AuthProvider } from "@/providers/auth-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { UrlProvider } from "@/providers/url-provider"
import type { PropsWithChildren } from "react"

export function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ally-studio-theme">
      <AuthProvider>
        <UrlProvider>
          <Space>
            <Website>
              <Page>{children}</Page>
            </Website>
          </Space>
        </UrlProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
