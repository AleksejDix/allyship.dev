import { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react"
import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type FieldProps = {
  name: string
  label: string
  type: HTMLInputTypeAttribute
  required?: boolean
  autoComplete?: HTMLInputAutoCompleteAttribute
  placeholder?: string
}

export function Field(props: FieldProps) {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>
            <span className="inline-flex gap-1">
              <span>{props.label}</span>
              {props.required && (
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              )}
            </span>
          </FormLabel>
          <FormControl>
            <Input
              type={props.type}
              {...field}
              autoComplete={props.autoComplete}
              placeholder={props.placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
