import { supabase } from "@/core/supabase"

import { Layout } from "./layout"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export function AuthRequired() {
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Send login success message
      chrome.runtime.sendMessage({
        type: "LOGIN_SUCCESS",
        session: data.session
      })
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <Layout>
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>AllyStudio</CardTitle>
            <CardDescription>Please log in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Log In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
