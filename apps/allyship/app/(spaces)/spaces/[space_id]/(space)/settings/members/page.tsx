import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/features/websites/components/page-header'
import { TeamMemberManager } from '@/features/spaces/components/TeamMemberManager'

type Props = {
  params: Promise<{ space_id: string }>
}

export default async function MembersPage(props: Props) {
  const params = await props.params
  const { space_id } = params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch account by ID
  const { data: accounts } = await supabase.rpc('get_accounts')
  const account = accounts?.find((acc: any) => acc.account_id === space_id)

  if (!account) {
    notFound()
  }

  // Check if user has owner access to this space
  const { data: memberData } = await supabase.rpc('get_account_members', {
    account_id: space_id,
  })

  const currentUserMember = memberData?.find(
    (member: any) => member.user_id === user.id
  )

  if (!currentUserMember || currentUserMember.account_role !== 'owner') {
    notFound()
  }

  return (
    <>
      <PageHeader
        title="Team Members"
        description="Manage who has access to this workspace"
      />
      <div className="container py-6">
        <TeamMemberManager
          accountId={space_id}
          currentUserId={user.id}
          currentUserRole={currentUserMember.account_role}
        />
      </div>
    </>
  )
}
