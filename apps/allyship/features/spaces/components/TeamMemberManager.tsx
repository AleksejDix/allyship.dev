'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'

import { Badge } from '@workspace/ui/components/badge'
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar'
import { Settings, Trash2, Crown } from 'lucide-react'

interface TeamMember {
  user_id: string
  email: string
  name?: string
  account_role: 'owner' | 'member'
  is_primary_owner: boolean
  created_at: string
}

interface TeamMemberManagerProps {
  accountId: string
  currentUserId: string
  currentUserRole: string
}

export function TeamMemberManager({
  accountId,
  currentUserId,
  currentUserRole,
}: TeamMemberManagerProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Load existing members
  useEffect(() => {
    loadMembers()
  }, [accountId])

  const loadMembers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.rpc('get_account_members', {
        account_id: accountId,
      })

      if (error) {
        toast.error('Failed to load team members')
        return
      }

      setMembers(data || [])
    } catch (error) {
      toast.error('An error occurred loading members')
    } finally {
      setLoading(false)
    }
  }

  const removeMember = async (userId: string) => {
    if (userId === currentUserId) {
      toast.error('You cannot remove yourself from the team')
      return
    }

    try {
      const { error } = await supabase.rpc('remove_account_member', {
        account_id: accountId,
        user_id: userId,
      })

      if (error) {
        toast.error(error.message || 'Failed to remove team member')
        return
      }

      setMembers(prev => prev.filter(m => m.user_id !== userId))
      toast.success('Team member removed')
    } catch (error) {
      toast.error('Failed to remove team member')
    }
  }

  const updateMemberRole = async (
    userId: string,
    newRole: 'owner' | 'member'
  ) => {
    try {
      const { error } = await supabase.rpc('update_account_user_role', {
        account_id: accountId,
        user_id: userId,
        new_account_role: newRole,
        make_primary_owner: false,
      })

      if (error) {
        toast.error(error.message || 'Failed to update team member role')
        return
      }

      setMembers(prev =>
        prev.map(m =>
          m.user_id === userId ? { ...m, account_role: newRole } : m
        )
      )
      toast.success('Team member role updated')
    } catch (error) {
      toast.error('Failed to update team member role')
    }
  }

  const canManageMembers = currentUserRole === 'owner'

  const getInitials = (name: string, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading members...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map(member => (
                  <TableRow key={member.user_id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">
                            {getInitials(member.name || '', member.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">
                              {member.name || member.email}
                            </div>
                            {member.is_primary_owner && (
                              <Badge variant="secondary" className="text-xs">
                                <Crown className="mr-1 h-3 w-3" />
                                Primary Owner
                              </Badge>
                            )}
                            {member.user_id === currentUserId && (
                              <Badge variant="outline" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.account_role === 'owner'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-xs capitalize"
                      >
                        {member.account_role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {canManageMembers &&
                        member.user_id !== currentUserId &&
                        !member.is_primary_owner && (
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateMemberRole(
                                  member.user_id,
                                  member.account_role === 'owner'
                                    ? 'member'
                                    : 'owner'
                                )
                              }
                            >
                              <Settings className="h-3 w-3" />
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeMember(member.user_id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {members.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No team members found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
