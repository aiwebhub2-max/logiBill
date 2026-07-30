import { createClient } from '@/utils/supabase/server'

export async function getAuthenticatedCompanyId() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // We find the company associated with this user
  const { data, error } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    console.error("Error fetching company for user:", error)
    // Fallback: if the user doesn't have a company yet (maybe trigger failed),
    // we could create one or throw an error. For SaaS, we usually expect it to exist.
    throw new Error('No company found for this user.')
  }

  return { companyId: data.id, supabase }
}
