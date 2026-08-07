import Link from 'next/link'
import { signup } from '../login/actions'
import { Zap } from 'lucide-react'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-4 sm:px-8 justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            logi<span className="text-brand-600">Bill</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">Créer un compte</h1>

        <form action={signup} className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700" htmlFor="first_name">
                Prénom
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm"
                name="first_name"
                placeholder="Ex: Franck"
                required
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700" htmlFor="last_name">
                Nom
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm"
                name="last_name"
                placeholder="Ex: M."
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700" htmlFor="company_name">
                Nom de l&apos;entreprise
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm"
                name="company_name"
                placeholder="Ex: MonEntreprise SARL"
                required
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700" htmlFor="job_title">
                Titre
              </label>
              <input
                className="w-full rounded-xl px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm"
                name="job_title"
                placeholder="Ex: Administrateur"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="email">
              Adresse e-mail
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700" htmlFor="password">
              Mot de passe
            </label>
            <input
              className="w-full rounded-xl px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-sm"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-4 py-3 font-semibold mt-4 transition-all shadow-md shadow-brand-500/20 active:scale-[0.98]"
          >
            Créer le compte
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>Vous avez déjà un compte ?</span>
            <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              Se connecter
            </Link>
          </div>

          {searchParams?.message && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 border border-red-100 text-center text-sm rounded-xl font-medium">
              {searchParams.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
