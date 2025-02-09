import { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute } from "react"
import { TriangleAlert } from "lucide-react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  FormControl,
  FormDescription,
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
  description?: string
  autoFocus?: boolean
  className?: string
}

export function Field(props: FieldProps) {
  const form = useFormContext()

  const isHidden = props.type === "hidden"

  return (
    <FormField
      control={form.control}
      name={props.name}
      render={(context) => (
        <FormItem className={cn("space-y-2", props.className)}>
          <FormLabel
            className={cn(
              "flex items-center justify-between min-h-4",
              isHidden && "sr-only"
            )}
          >
            <span className="inline-flex gap-1">
              <span>{props.label}</span>
              {props.required && (
                <span aria-hidden="true" className="text-red-500">
                  *
                </span>
              )}
            </span>
            <span>
              {context.fieldState.invalid ? (
                <TriangleAlert
                  size={16}
                  aria-hidden="true"
                  className="text-destructive"
                />
              ) : null}
            </span>
          </FormLabel>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormControl>
            <Input
              type={props.type}
              {...context.field}
              autoComplete={props.autoComplete}
              placeholder={props.placeholder}
              autoFocus={props.autoFocus}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
