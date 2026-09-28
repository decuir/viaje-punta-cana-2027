'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function ErrorPanel({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error('Fallo en el panel:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mx-auto max-w-lg py-24 text-center">
        <h1 className="text-2xl font-bold">Algo falló en el panel</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Tu último cambio pudo haberse guardado. Reintenta antes de repetirlo.
        </p>

        <pre className="mt-6 overflow-x-auto rounded-md bg-slate-100 p-4 text-left text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300">
          {error.message}
          {error.digest ? `\n\nReferencia: ${error.digest}` : ''}
        </pre>

        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => retry()}>Reintentar</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Recargar la página
          </Button>
        </div>
      </div>
    </div>
  )
}
