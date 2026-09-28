'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, LogOut, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OPCIONES_NIVEL, etiquetaNivel } from '@/lib/niveles'
import { PERIODOS, periodoActual, periodoDeFecha, rangoLegible } from '@/lib/periodos'

// Numero del administrador que recibe el aviso de evidencia nueva.
const WHATSAPP_ADMIN = '5215512745072'

function enlaceAviso({
  nombre,
  correo,
  id,
  nivel,
}: {
  nombre: string
  correo: string
  id: string
  nivel: string
}) {
  const texto = [
    'Nueva evidencia para el Viaje Punta Cana 2027',
    `Distribuidor: ${nombre}`,
    `Correo: ${correo}`,
    `ID: ${id}`,
    `Tipo de compra: ${etiquetaNivel(Number(nivel))}`,
    'Queda pendiente de aprobación en el panel.',
  ].join('\n')
  return `https://wa.me/${WHATSAPP_ADMIN}?text=${encodeURIComponent(texto)}`
}

export function DistributorDashboard({ user, nombre }: { user: any; nombre: string }) {
  const [totalPoints, setTotalPoints] = useState(0)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedLevel, setSelectedLevel] = useState('1')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [miId, setMiId] = useState('')
  const [avisoWhatsapp, setAvisoWhatsapp] = useState('')

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const supabase = createClient()

      const { data: distributor } = await supabase
        .from('distributors')
        .select('*')
        .eq('auth_id', user.id)
        .single()

      if (distributor) {
        setMiId(distributor.distributor_id || '')

        const { data: points } = await supabase
          .from('submissions')
          .select('points')
          .eq('distributor_id', distributor.id)
          .eq('status', 'approved')

        const total = points?.reduce((sum, p) => sum + (p.points || 0), 0) || 0
        setTotalPoints(total)

        const { data: subs } = await supabase
          .from('submissions')
          .select('*')
          .eq('distributor_id', distributor.id)
          .order('created_at', { ascending: false })

        setSubmissions(subs || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError('Selecciona una imagen')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const supabase = createClient()

      const { data: distributor, error: distError } = await supabase
        .from('distributors')
        .select('id')
        .eq('auth_id', user.id)
        .single()

      if (distError || !distributor) {
        throw new Error('No se encontró tu perfil. Contacta al administrador.')
      }

      const ext = selectedFile.name.split('.').pop() || 'jpg'
      const path = `${distributor.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(path, selectedFile, { contentType: selectedFile.type })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('submissions').getPublicUrl(path)
      const publicUrl = urlData.publicUrl

      const { data: campaign } = await supabase
        .from('campaigns')
        .select('id')
        .limit(1)
        .single()

      const { error: insertError } = await supabase
        .from('submissions')
        .insert({
          distributor_id: distributor.id,
          image_url: publicUrl,
          status: 'pending',
          level: parseInt(selectedLevel),
          points: 0,
          campaign_id: campaign?.id || null
        })

      if (insertError) throw insertError

      setSuccess('Evidencia enviada para aprobación')
      setAvisoWhatsapp(
        enlaceAviso({ nombre, correo: user.email || '', id: miId, nivel: selectedLevel })
      )
      setSelectedFile(null)
      setSelectedLevel('1')
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const progress = (totalPoints / 90) * 100
  const periodoEnCurso = periodoActual()

  const puntosPorPeriodo = new Map<string, number>()
  for (const s of submissions) {
    if (s.status !== 'approved') continue
    const p = periodoDeFecha(s.created_at)
    if (!p) continue
    puntosPorPeriodo.set(p.codigo, (puntosPorPeriodo.get(p.codigo) || 0) + (s.points || 0))
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Hola, {nombre}</h1>
            <p className="text-sm text-slate-500">Mi Panel de Viaje</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progreso hacia Punta Cana 🏖️</CardTitle>
            <CardDescription>Necesitas 90 puntos para ganar el viaje</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{totalPoints} / 90 puntos</span>
                <span className={`font-semibold ${
                  totalPoints >= 90 ? 'text-green-600' :
                  totalPoints > 50 ? 'text-yellow-600' :
                  'text-slate-500'
                }`}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 dark:bg-slate-700">
                <div
                  className={`h-4 rounded-full transition-all duration-300 ${
                    totalPoints >= 90 ? 'bg-green-500' :
                    totalPoints > 50 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
            {totalPoints >= 90 && (
              <div className="flex gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 border border-green-200">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>¡Felicidades! Ya ganaste tu viaje a Punta Cana 🎉</span>
              </div>
            )}
            {totalPoints > 50 && totalPoints < 90 && (
              <div className="flex gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>¡Vas bien! Te faltan {90 - totalPoints} puntos para ganar</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Puntos por Período</CardTitle>
            <CardDescription>Calendario oficial de calificación · 12 semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-2 border-b pb-2 text-xs font-bold text-slate-600">
                <div className="col-span-2">Semana</div>
                <div className="col-span-3">Período</div>
                <div className="col-span-4">Fechas</div>
                <div className="col-span-3 text-right">Puntos</div>
              </div>
              {PERIODOS.map((p) => {
                const puntos = puntosPorPeriodo.get(p.codigo) || 0
                const esActual = p.codigo === periodoEnCurso?.codigo
                return (
                  <div
                    key={p.codigo}
                    className={`grid grid-cols-12 gap-2 rounded px-1 py-2 text-sm ${
                      esActual ? 'bg-blue-50 font-medium dark:bg-blue-950' : ''
                    }`}
                  >
                    <div className="col-span-2">{p.semana}</div>
                    <div className="col-span-3 text-slate-600 dark:text-slate-400">{p.codigo}</div>
                    <div className="col-span-4 text-xs text-slate-500">{rangoLegible(p)}</div>
                    <div className={`col-span-3 text-right ${puntos > 0 ? 'font-semibold text-green-600' : 'text-slate-400'}`}>
                      {puntos}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subir Evidencia de Compra</CardTitle>
            <CardDescription>Sube tu recibo del paquete promocional</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Tipo de compra</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPCIONES_NIVEL.map((o) => (
                      <SelectItem key={o.valor} value={o.valor}>
                        {o.etiqueta}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Imagen de compra</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      {selectedFile ? selectedFile.name : 'Haz clic o arrastra tu imagen'}
                    </p>
                  </label>
                </div>
              </div>

              {error && (
                <div className="flex gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              {avisoWhatsapp && (
                <a
                  href={avisoWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                >
                  Avisar al administrador por WhatsApp
                </a>
              )}

              <Button type="submit" className="w-full" disabled={loading || !selectedFile}>
                {loading ? 'Subiendo...' : 'Enviar Evidencia'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tus Envíos</CardTitle>
            <CardDescription>Historial de evidencias subidas</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-slate-500 text-sm">No has subido evidencias aún</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{etiquetaNivel(sub.level)}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {sub.status === 'pending' && (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">Pendiente</span>
                        </div>
                      )}
                      {sub.status === 'approved' && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">+{sub.points} pts</span>
                        </div>
                      )}
                      {sub.status === 'rejected' && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs">Rechazado</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
