'use client'

import { signup } from '@/features/user/actions/user-actions'
import { LoginWithGoogle } from '@/features/user/components/user-login-with-google'
import { loginFormSchema } from '@/features/user/schemas/user-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, TriangleAlert } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'

import { cn } from '@/lib/utils'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import { Form } from '@workspace/ui/components/form'
import { Field } from '@workspace/ui/components/field'
import { RouterLink } from '@/components/RouterLink'
import { Logo } from '@/components/site/Logo'

export function UserSignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const { execute, isPending } = useServerAction(signup)

  const onSubmit = async (formData: z.infer<typeof loginFormSchema>) => {
    const [data, validationError] = await execute(formData) // Pass the form data to the server action
    console.log({ data, validationError })
    if (validationError) {
      if (validationError.code === 'INPUT_PARSE_ERROR') {
        Object.entries(validationError.fieldErrors).forEach(
          ([field, messages]) => {
            form.setError(field as keyof z.infer<typeof loginFormSchema>, {
              type: 'server',
              message: messages?.join(', '),
            })
          }
        )
      } else {
        console.error({ validationError })
      }
    }

    if (data && !data.success) {
      form.setError('root.serverError', {
        message: data.error?.message,
        type: 'server',
      })
    } else if (data?.success) {
      form.reset()
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="mx-auto">
        <Logo />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            <h1 id="login-form">Sign up</h1>
          </CardTitle>
          <CardDescription>
            {/*  IT should describe why you need an account */}
            Create an allyship.dev account to access the courses, resources and
            monitoring tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              aria-labelledby="login-form"
              noValidate
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={() => withOAuth("github")}
                    className="w-full"
                  >
                    Sign up with GitHub
                  </Button> */}

                  <LoginWithGoogle />
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with credentials
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <Field
                    type="email"
                    name="username"
                    label="E-Mail"
                    autoComplete="username"
                    required
                  />
                  <Field
                    type="password"
                    name="password"
                    label="Password"
                    autoComplete="new-password"
                    description="Must be at least 6 characters long"
                    required
                  />
                </div>

                {form.formState?.errors?.root?.serverError?.type ===
                  'server' && (
                  <Alert variant="destructive">
                    <TriangleAlert aria-hidden="true" size={16} />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>
                      {form.formState?.errors?.root?.serverError?.message}
                    </AlertDescription>
                  </Alert>
                )}

                {form.formState.isSubmitSuccessful &&
                  !(
                    form.formState?.errors?.root?.serverError?.type === 'server'
                  ) && (
                    <Alert variant="success">
                      <TriangleAlert aria-hidden="true" size={16} />
                      <AlertTitle>Check your email</AlertTitle>
                      <AlertDescription>
                        We sent you an email to verify your account.
                      </AlertDescription>
                    </Alert>
                  )}

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <LoaderCircle
                      className="-ms-1 me-2 animate-spin"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  ) : null}
                  {isPending ? 'Creating account...' : 'Create new account'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="gap-4 text-sm">
          <RouterLink
            href="/auth/login"
            className="underline underline-offset-4"
          >
            Log in
          </RouterLink>
        </CardFooter>
      </Card>
    </div>
  )
}
