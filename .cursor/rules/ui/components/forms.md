---
description: Form handling and validation patterns
globs: "**/*.{ts,tsx}"
---

# Form Handling Guidelines

## Core Form Pattern

### Basic Form Structure

✅ Use React Hook Form + Zod:

```tsx
// components/forms/contact-form.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type FormData = z.infer<typeof formSchema>

export function ContactForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(data: FormData) {
    // Handle form submission
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Other fields */}
    </form>
  )
}
```

❌ Avoid uncontrolled forms:

```tsx
// Don't use uncontrolled forms without validation
export function BadForm() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const data = new FormData(form)
    // Bad: No validation, no type safety
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Form Components

### Form Field Component

✅ Use reusable form fields:

```tsx
// components/ui/form.tsx
import { useFormContext } from "react-hook-form"

interface FormFieldProps {
  name: string
  label: string
  type?: "text" | "email" | "password"
}

export function FormField({ name, label, type = "text" }: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <div className="form-field">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input {...register(name)} type={type} id={name} className="input" />
      {errors[name]?.message && (
        <span className="error">{errors[name]?.message as string}</span>
      )}
    </div>
  )
}
```

## Validation Patterns

### Complex Validation

✅ Use Zod for complex validation:

```typescript
// lib/validations/user.ts
import { z } from "zod"

export const userFormSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
```

### Custom Validation

✅ Use async validation:

```typescript
// lib/validations/username.ts
import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

export const usernameSchema = z.string().refine(
  async (username) => {
    const supabase = await createClient()
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single()

    return !data // Return true if username is available
  },
  {
    message: "Username is already taken",
  }
)
```

## Form Submission

### Server Action Submission

✅ Use Server Actions:

```tsx
// app/actions/contact.ts
"use server"

import { z } from "zod"

import { createClient } from "@/lib/supabase/server"

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
})

export async function submitContact(formData: FormData) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  })

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("contact_messages")
    .insert(validatedFields.data)

  if (error) {
    return { error: "Failed to submit message" }
  }

  return { success: true }
}
```

### Form State Handling

✅ Handle loading and error states:

```tsx
// components/forms/submit-button.tsx
"use client"

import { useFormStatus } from "react-dom"

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={pending ? "opacity-50 cursor-not-allowed" : ""}
    >
      {pending ? "Submitting..." : "Submit"}
    </button>
  )
}
```

## Form Accessibility

### Accessible Forms

✅ Implement proper accessibility:

```tsx
// components/forms/accessible-form.tsx
export function AccessibleForm() {
  return (
    <form
      aria-labelledby="form-title"
      noValidate // Use JS validation
      className="space-y-4"
    >
      <h2 id="form-title" className="text-xl font-bold">
        Contact Us
      </h2>

      <div role="group" aria-labelledby="personal-info">
        <span id="personal-info" className="sr-only">
          Personal Information
        </span>

        <FormField
          label="Email"
          type="email"
          name="email"
          aria-required="true"
          aria-describedby="email-error"
        />
        <div id="email-error" aria-live="polite">
          {errors.email?.message}
        </div>
      </div>

      {/* Other fields */}
    </form>
  )
}
```

## Form Error Handling

### Error Display

✅ Show form errors properly:

```tsx
// components/forms/error-message.tsx
interface FormErrorProps {
  id: string
  errors?: Record<string, string[]>
}

export function FormError({ id, errors }: FormErrorProps) {
  if (!errors?.[id]) {
    return null
  }

  return (
    <div id={`${id}-error`} aria-live="polite" className="text-sm text-red-500">
      {errors[id].map((error: string) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  )
}
```

## Form Layout

### Responsive Form Layout

✅ Use proper form layout:

```tsx
// components/forms/responsive-form.tsx
export function ResponsiveForm() {
  return (
    <form className="max-w-md mx-auto space-y-8 p-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
        <FormField
          name="firstName"
          label="First Name"
          className="sm:col-span-1"
        />
        <FormField
          name="lastName"
          label="Last Name"
          className="sm:col-span-1"
        />
        <FormField
          name="email"
          label="Email"
          type="email"
          className="sm:col-span-2"
        />
        <FormField
          name="message"
          label="Message"
          type="textarea"
          className="sm:col-span-2"
        />
      </div>

      <div className="flex justify-end gap-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}
```
