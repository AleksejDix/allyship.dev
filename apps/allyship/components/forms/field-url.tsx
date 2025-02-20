import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'

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
