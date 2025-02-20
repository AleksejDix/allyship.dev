'use client'

import { signOut } from '@/features/user/actions/user-actions'
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu'

export function SignoutButton() {
  return <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
}
