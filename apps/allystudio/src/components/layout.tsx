import { Connector } from "@/components/connector/connector"
import { Space } from "@/components/space/space"
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
            <Connector />
            {children}
          </Space>
        </UrlProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
