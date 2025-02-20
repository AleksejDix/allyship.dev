import { Layout } from "./layout"
import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card"

export function AuthRequired() {
  return (
    <Layout>
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to use Allyship Studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => chrome.runtime.openOptionsPage()}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
