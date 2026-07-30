import Link from 'next/link'
import { signup } from '../login/actions'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        <h1 className="text-2xl font-semibold text-center mb-6">Créer un compte</h1>
        <label className="text-md font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="email"
          placeholder="vous@exemple.com"
          required
        />
        <label className="text-md font-medium" htmlFor="password">
          Mot de passe
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={6}
        />
        <button
          formAction={signup}
          className="bg-green-600 rounded-md px-4 py-2 text-white font-medium hover:bg-green-700 mt-4 transition-colors"
        >
          S'inscrire
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </p>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-gray-100 text-center text-sm rounded-md">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
