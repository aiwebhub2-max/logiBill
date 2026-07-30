import Link from 'next/link'
import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto min-h-screen">
      <form className="flex-1 flex flex-col w-full justify-center gap-4 text-foreground">
        <h1 className="text-2xl font-semibold text-center mb-6">Connexion</h1>
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
        />
        <button
          formAction={login}
          className="bg-blue-600 rounded-md px-4 py-2 text-white font-medium hover:bg-blue-700 mt-4 transition-colors"
        >
          Se connecter
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Pas encore de compte ?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            S'inscrire
          </Link>
        </p>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-gray-100 text-center text-sm rounded-md text-red-600">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
