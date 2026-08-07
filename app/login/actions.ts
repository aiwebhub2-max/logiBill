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
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return null
  }
  try {
    const posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        flushAt: 1,
        flushInterval: 0
      }
    )
    return posthogClient
  } catch (error) {
    console.error("PostHog initialization error:", error)
    return null
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signupSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  company_name: z.string().min(2),
  job_title: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(formData: FormData) {
  console.log('--- LOGIN ACTION TRIGGERED ---')
  console.log('FormData:', Object.fromEntries(formData.entries()))
  
  if (!checkRateLimit()) {
    console.log('--- RATE LIMIT HIT ---')
    redirect('/login?message=Trop de tentatives, veuillez réessayer plus tard.')
  }

  const supabase = createClient()

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/login?message=Format d\'email ou de mot de passe invalide')
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    console.error("Login error:", error)
    if (error.message.includes('Email not confirmed')) {
      redirect('/login?message=Veuillez vérifier votre adresse e-mail avant de vous connecter.')
    }
    redirect('/login?message=Adresse e-mail ou mot de passe incorrect.')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  if (!checkRateLimit()) {
    redirect('/signup?message=Trop de tentatives, veuillez réessayer plus tard.')
  }

  const supabase = createClient()

  const parsed = signupSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    company_name: formData.get('company_name'),
    job_title: formData.get('job_title'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/signup?message=Veuillez remplir correctement tous les champs requis')
  }

  const { data: authData, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        company_name: parsed.data.company_name,
        job_title: parsed.data.job_title,
      }
    }
  })

  if (error) {
    console.error("Signup error:", error)
    if (error.message.includes('already registered') || error.status === 422) {
      redirect('/signup?message=Cet adresse e-mail est déjà utilisée. Veuillez vous connecter.')
    }
    redirect('/signup?message=Erreur lors de l\'inscription')
  }

  if (authData.user) {
    const posthog = PostHogClient()
    if (posthog) {
      posthog.capture({
        distinctId: authData.user.id,
        event: 'user_signed_up',
        properties: {
          email: parsed.data.email,
          company: parsed.data.company_name,
        },
      })
      await posthog.shutdown()
    }
  }

  revalidatePath('/', 'layout')
  
  // If email confirmation is disabled in Supabase, a session is returned immediately
  if (authData.session) {
    redirect('/dashboard')
  } else {
    redirect('/login?message=Vérifiez votre email pour continuer l\'inscription')
  }
}

export async function signout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
