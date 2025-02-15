"use client"

import { useRouter } from "next/navigation"
import { deleteDomain } from "@/features/domain/actions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Field } from "@/components/forms/field"

const formSchema = z
  .object({
    name: z.string().min(1, "Domain name is required"),
    confirmName: z.string(),
  })
  .refine((data) => data.name === data.confirmName, {
    message: "Please type the domain name to confirm",
    path: ["confirmName"],
  })

type FormData = z.infer<typeof formSchema>

type Domain = {
  id: string
  name: string
}

type Props = {
  domain: Domain
  spaceId: string
}

export function DomainDelete({ domain, spaceId }: Props) {
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    values: {
      name: domain.name,
      confirmName: "",
    },
  })

  const { execute, isPending } = useServerAction(deleteDomain)

  const onSubmit = async () => {
    const [result, error] = await execute({
      domainId: domain.id,
      spaceId: spaceId,
    })

    if (error) {
      form.setError("root", {
        type: "server",
        message: error.message,
      })
      return
    }

    if (!result?.success) {
      form.setError("root", {
        type: "server",
        message: "Failed to delete domain",
      })
      return
    }

    router.push(`/spaces/${spaceId}`)
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle>Delete Domain</CardTitle>
            <CardDescription>
              Permanently remove your domain and all of its pages from the
              platform. This action is not reversible — please continue with
              caution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Field
              name="name"
              label="Domain Name"
              type="hidden"
              autoComplete="off"
            />

            <Field
              name="confirmName"
              label="Domain Name"
              type="text"
              autoComplete="off"
              description="Please type the domain name to delete"
            />

            {form.formState.errors.root && (
              <div
                className="text-sm text-destructive mt-2"
                role="alert"
                aria-live="polite"
              >
                {form.formState.errors.root.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-end py-4 border-t border-destructive/50 bg-destructive/5">
            <Button
              type="submit"
              size="sm"
              variant="destructive"
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Domain"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
