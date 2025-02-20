import Link from 'next/link'

import { Button } from '@workspace/ui/components/button'

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-3xl font-bold">Welcome! 🎉</h1>

        <div className="space-y-2">
          <p className="text-lg">
            Thank you for confirming your email address.
          </p>
          <p className="text-muted-foreground">
            Your account is now fully activated and ready to use. You can now
            log in to your account
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/auth/login">Log in</Link>
        </Button>
      </div>
    </div>
  )
}
