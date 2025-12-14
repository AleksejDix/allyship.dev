"use client"

import { ComponentPropsWithoutRef, useMemo, useState } from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAccounts, type AccountWithRole } from "@/lib/hooks/use-accounts"
import { SpaceCreateForm } from "./SpaceCreateForm"

type PopoverTriggerProps = ComponentPropsWithoutRef<typeof PopoverTrigger>

interface AccountSelectorProps extends PopoverTriggerProps {
  accountId: string
  placeholder?: string
  onAccountSelected?: (account: AccountWithRole) => void
}

export function AccountSelector({
  className,
  accountId,
  onAccountSelected,
  placeholder = "Select an account...",
}: AccountSelectorProps) {
  const [open, setOpen] = useState(false)
  const [showNewSpaceDialog, setShowNewSpaceDialog] = useState(false)
  const router = useRouter()

  const { data: accounts } = useAccounts()

  const { teamAccounts, personalAccount, selectedAccount } = useMemo(() => {
    const personalAccount = accounts?.find((account) => account.personal_account)
    const teamAccounts = accounts?.filter((account) => !account.personal_account)
    const selectedAccount = accounts?.find(
      (account) => account.account_id === accountId
    )

    return {
      personalAccount,
      teamAccounts,
      selectedAccount,
    }
  }, [accounts, accountId])

  const handleAccountSelect = (account: AccountWithRole) => {
    if (onAccountSelected) {
      onAccountSelected(account)
    } else {
      // Default behavior: navigate to account dashboard
      if (account.personal_account) {
        router.push("/dashboard")
      } else {
        router.push(`/dashboard/${account.slug}`)
      }
    }
    setOpen(false)
  }

  return (
    <Dialog open={showNewSpaceDialog} onOpenChange={setShowNewSpaceDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select an account"
            className={cn("w-[250px] justify-between", className)}
          >
            {selectedAccount?.name || placeholder}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search account..." />
              <CommandEmpty>No account found.</CommandEmpty>
              {personalAccount && (
                <CommandGroup heading="Personal Account">
                  <CommandItem
                    key={personalAccount.account_id}
                    onSelect={() => handleAccountSelect(personalAccount)}
                    className="text-sm"
                  >
                    {personalAccount.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedAccount?.account_id === personalAccount.account_id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
              )}
              {Boolean(teamAccounts?.length) && (
                <CommandGroup heading="Spaces">
                  {teamAccounts?.map((team) => (
                    <CommandItem
                      key={team.account_id}
                      onSelect={() => handleAccountSelect(team)}
                      className="text-sm"
                    >
                      {team.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedAccount?.account_id === team.account_id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    value="new-space"
                    onSelect={() => {
                      setOpen(false)
                      setShowNewSpaceDialog(true)
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Space
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new space</DialogTitle>
          <DialogDescription>
            Create a space to organize your websites and collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <SpaceCreateForm />
      </DialogContent>
    </Dialog>
  )
}
