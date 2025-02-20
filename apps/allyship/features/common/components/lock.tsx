import { ReactNode } from 'react'
import Link from 'next/link'
import { Lock as LockIcon } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'

interface LockProps {
  children: ReactNode
}

function DefaultLockMessage() {
  return (
    <Card>
      <CardHeader className="flex flex-col items-center pt-8">
        <div className="flex items-center justify-center rounded-md bg-green-500/10 p-2 mb-2">
          <LockIcon className="text-green-500" />
        </div>
        <CardTitle className="mt-6">Premium Feature</CardTitle>
        <CardDescription>
          This feature is only available on paid plans
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center gap-4">
        <Button variant="secondary" asChild>
          <Link href="/auth/signup">Sign up</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export async function Lock({ children }: LockProps) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return <DefaultLockMessage />
  }

  return children
}
