// import NameForm from "@workspace/ui/components/AccountForms/NameForm"
import { redirect } from 'next/navigation'
import { EmailUpdate } from '@/features/user/features/email/update'
import { PasswordUpdate } from '@/features/user/features/password/update'

import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/page-header'

export default async function Account() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  return (
    <section className="container max-w-5xl py-8">
      <PageHeader heading="Account" />
      <div className=" space-y-4">
        <EmailUpdate email={user.email} />
        <PasswordUpdate />
      </div>
    </section>
  )
}
