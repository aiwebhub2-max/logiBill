'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { PostHog } from 'posthog-node'

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

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error("Login error:", error)
    const errorMsg = error.message ? error.message : JSON.stringify(error)
    redirect(`/login?message=${encodeURIComponent(errorMsg)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    console.error("Signup error:", error)
    const errorMsg = error.message ? error.message : JSON.stringify(error)
    redirect(`/signup?message=${encodeURIComponent(errorMsg)}`)
  }

  if (authData.user) {
    const posthog = PostHogClient()
    posthog.capture({
      distinctId: authData.user.id,
      event: 'user_signed_up',
      properties: {
        email: data.email,
      },
    })
    await posthog.shutdown()
  }

  revalidatePath('/', 'layout')
  // We'll redirect to a generic welcome page or dashboard
  // Depending on email verification settings, user may need to check email.
  redirect('/login?message=Check email to continue sign in process')
}

export async function signout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
