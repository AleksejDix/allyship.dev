import { redirect } from "next/navigation"

import { createClient } from "@/lib/auth/server"
import { getSubscription, getUser } from "@/lib/db/queries"
import { FormEmailUpdate } from "@/app/(account)/_components/FormEmailUpdate"

// import NameForm from "@/components/ui/AccountForms/NameForm"

export default async function Account() {
  const supabase = await createClient()
  const [user] = await Promise.all([
    getUser(supabase),
    getSubscription(supabase),
    // getUserDetails(supabase),
  ])

  if (!user) {
    return redirect("/auth/login")
  }

  return (
    <section className="container max-w-md py-8">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6  lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
        </div>
      </div>
      <div className="p-4">
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
        <FormEmailUpdate email={user.email} />
        {/* <FormCustomerPortal subscription={subscription} /> */}
        {/*  <NameForm userName={userDetails?.full_name ?? ""} />
         */}
      </div>
    </section>
  )
}
