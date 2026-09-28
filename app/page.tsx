import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { AuthForm } from '@/components/auth-form'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ sinRegistro?: string }>
}) {
  const { sinRegistro } = await searchParams
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Viaje Punta Cana 2027
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Sistema de Control de Evidencias - Sinergia Global
          </p>
        </div>

        {sinRegistro && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Tu correo no tiene un registro completo. Regístrate con tu nombre e ID de
            distribuidor para poder entrar.
          </div>
        )}

        <AuthForm />

        <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            <strong>Distribuidores:</strong> Regístrate, sube evidencias de tu compra y acumula puntos.
            <br />
            <strong>Meta:</strong> 90 puntos para ganar el viaje.
            <br />
            <strong>Período:</strong> 12 semanas (del 28 de sept. al 21 de dic.)
          </p>
        </div>
      </div>
    </div>
  )
}
