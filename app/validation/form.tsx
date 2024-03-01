"use client"

import * as z from "zod"

export const signInformSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
})


export const signUpformSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
  email: z.string().min(2).max(50),
})