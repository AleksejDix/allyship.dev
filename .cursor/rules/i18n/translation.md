---
description: Internationalization patterns and best practices
globs: "**/*.{ts,tsx}"
---

# Internationalization Guidelines

## Core Setup

### Dictionary Setup

✅ Set up language dictionaries:

```tsx
// dictionaries/en.json
{
  "common": {
    "buttons": {
      "submit": "Submit",
      "cancel": "Cancel",
      "save": "Save",
      "delete": "Delete"
    },
    "errors": {
      "required": "This field is required",
      "invalid": "Invalid value",
      "server": "Server error occurred"
    },
    "loading": "Loading...",
    "empty": "No items found"
  },
  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "forgotPassword": "Forgot Password?",
    "resetPassword": "Reset Password"
  },
  "forms": {
    "email": "Email",
    "password": "Password",
    "name": "Name",
    "confirmPassword": "Confirm Password"
  }
}

// dictionaries/es.json
{
  "common": {
    "buttons": {
      "submit": "Enviar",
      "cancel": "Cancelar",
      "save": "Guardar",
      "delete": "Eliminar"
    },
    "errors": {
      "required": "Este campo es obligatorio",
      "invalid": "Valor inválido",
      "server": "Se produjo un error del servidor"
    },
    "loading": "Cargando...",
    "empty": "No se encontraron elementos"
  },
  "auth": {
    "signIn": "Iniciar Sesión",
    "signUp": "Registrarse",
    "forgotPassword": "¿Olvidaste tu contraseña?",
    "resetPassword": "Restablecer Contraseña"
  },
  "forms": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "name": "Nombre",
    "confirmPassword": "Confirmar Contraseña"
  }
}
```

### Dictionary Loading

✅ Load dictionaries based on locale:

```tsx
// lib/dictionary.ts
import "server-only"

const dictionaries = {
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
  es: () => import("@/dictionaries/es.json").then((m) => m.default),
}

export type Locale = keyof typeof dictionaries
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}

// Usage in pages
export default async function Page({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)

  return (
    <form>
      <label>{dict.forms.email}</label>
      <input type="email" />
      <button type="submit">{dict.common.buttons.submit}</button>
    </form>
  )
}
```

## Routing

### Locale Middleware

✅ Set up locale middleware:

```tsx
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match as matchLocale } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

const locales = ["en", "es"]
const defaultLocale = "en"

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })

  const languages = new Negotiator({
    headers: negotiatorHeaders,
  }).languages()

  return matchLocale(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

### Locale Links

✅ Create locale-aware links:

```tsx
// components/locale-link.tsx
import Link from "next/link"
import { useParams } from "next/navigation"

interface LocaleLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

export function LocaleLink({ href, children, ...props }: LocaleLinkProps) {
  const { lang } = useParams()
  const localizedHref = `/${lang}${href}`

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  )
}

// Usage
export function Navigation() {
  return (
    <nav>
      <LocaleLink href="/">Home</LocaleLink>
      <LocaleLink href="/about">About</LocaleLink>
      <LocaleLink href="/contact">Contact</LocaleLink>
    </nav>
  )
}
```

## Date and Number Formatting

### Date Formatting

✅ Format dates based on locale:

```tsx
// lib/formatting.ts
export function formatDate(
  date: Date | string,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "long",
  }
) {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(d)
}

// Usage
export function PostDate({ date, locale }: { date: string; locale: string }) {
  return <time dateTime={date}>{formatDate(date, locale)}</time>
}

// Format relative time
export function formatRelativeTime(date: Date | string, locale: string) {
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const units: Intl.RelativeTimeFormatUnit[] = [
    "year",
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
  ]

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
  })

  for (const unit of units) {
    const value = getUnitValue(diff, unit)
    if (Math.abs(value) > 0) {
      return rtf.format(-value, unit)
    }
  }

  return rtf.format(0, "second")
}
```

### Number Formatting

✅ Format numbers based on locale:

```tsx
// lib/formatting.ts
export function formatNumber(
  number: number,
  locale: string,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat(locale, options).format(number)
}

export function formatCurrency(
  amount: number,
  locale: string,
  currency: string
) {
  return formatNumber(amount, locale, {
    style: "currency",
    currency,
  })
}

// Usage
export function ProductPrice({
  amount,
  locale,
  currency = "USD",
}: {
  amount: number
  locale: string
  currency?: string
}) {
  return <span>{formatCurrency(amount, locale, currency)}</span>
}
```

## Dynamic Content

### Content Loading

✅ Load content based on locale:

```tsx
// lib/content.ts
interface LocalizedContent {
  title: string
  description: string
  content: string
}

export async function getLocalizedContent(
  slug: string,
  locale: string
): Promise<LocalizedContent> {
  const content = await fetch(`/api/content/${slug}?locale=${locale}`).then(
    (res) => res.json()
  )

  return content
}

// Usage in pages
export default async function Page({
  params: { lang, slug },
}: {
  params: { lang: string; slug: string }
}) {
  const content = await getLocalizedContent(slug, lang)

  return (
    <article>
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      <div>{content.content}</div>
    </article>
  )
}
```

### Dynamic Messages

✅ Handle dynamic message interpolation:

```tsx
// lib/messages.ts
type InterpolationValues = Record<string, string | number>

export function interpolate(message: string, values: InterpolationValues) {
  return message.replace(/{(\w+)}/g, (match, key) =>
    String(values[key] ?? match)
  )
}

// Usage
export function WelcomeMessage({
  dict,
  username,
}: {
  dict: Dictionary
  username: string
}) {
  const message = interpolate(dict.welcome.greeting, { username })

  return <h1>{message}</h1>
}
```

## Form Validation

### Localized Validation

✅ Implement localized form validation:

```tsx
// lib/validation.ts
import { z } from "zod"

export function createValidationSchema(dict: Dictionary) {
  return z.object({
    email: z
      .string()
      .min(1, dict.errors.required)
      .email(dict.errors.invalidEmail),
    password: z
      .string()
      .min(1, dict.errors.required)
      .min(8, dict.errors.passwordTooShort),
  })
}

// Usage in forms
export function LoginForm({ dict }: { dict: Dictionary }) {
  const form = useForm({
    resolver: zodResolver(createValidationSchema(dict)),
  })

  return (
    <form>
      <div>
        <label>{dict.forms.email}</label>
        <input {...form.register("email")} />
        {form.formState.errors.email && (
          <span>{form.formState.errors.email.message}</span>
        )}
      </div>
      <button type="submit">{dict.common.buttons.submit}</button>
    </form>
  )
}
```
