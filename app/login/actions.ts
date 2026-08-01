'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { PostHog } from 'posthog-node'
import { headers } from 'next/headers'
import { LRUCache } from 'lru-cache'
import { z } from 'zod'

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
})

function checkRateLimit() {
  const ip = headers().get('x-forwarded-for') || '127.0.0.1'
  const count = (rateLimit.get(ip) as number) || 0
  if (count >= 5) {
    return false
  }
  rateLimit.set(ip, count + 1)
  return true
}

function PostHogClient() {
  const posthogClient = new PostHog(
    process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
    {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0
    }
  )
  return posthogClient
}

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(formData: FormData) {
  if (!checkRateLimit()) {
    redirect('/login?message=Trop de tentatives, veuillez réessayer plus tard.')
  }

  const supabase = createClient()

  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/login?message=Format d\'email ou de mot de passe invalide')
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error("Login error:", error)
    redirect('/login?message=Identifiants invalides')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  if (!checkRateLimit()) {
    redirect('/signup?message=Trop de tentatives, veuillez réessayer plus tard.')
  }

  const supabase = createClient()

  const parsed = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/signup?message=Format d\'email ou de mot de passe invalide')
  }

  const { data: authData, error } = await supabase.auth.signUp(parsed.data)

  if (error) {
    console.error("Signup error:", error)
    redirect('/signup?message=Erreur lors de l\'inscription')
  }

  if (authData.user) {
    const posthog = PostHogClient()
    posthog.capture({
      distinctId: authData.user.id,
      event: 'user_signed_up',
      properties: {
        email: parsed.data.email,
      },
    })
    await posthog.shutdown()
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Vérifiez votre email pour continuer l\'inscription')
}

export async function signout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
