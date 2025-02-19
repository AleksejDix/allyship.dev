import { z } from "zod"

export const email = z.string().email()

export const url = z.string().url()

export const name = z.string().min(1)

export const password = z.string().min(8)
