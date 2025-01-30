import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function FieldUrl() {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name="url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Root URL <span aria-hidden="true">*</span>
          </FormLabel>
          <FormControl>
            <Input type="url" {...field} autoComplete="url" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
