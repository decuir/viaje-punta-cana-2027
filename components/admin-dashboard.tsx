'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LogOut, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

const META_PUNTOS = 90
const MEDIA_META = META_PUNTOS / 2

export function AdminDashboard({ user }: { user: any }) {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPoints, setEditingPoints] = useState('')
  const [distributors, setDistributors] = useState<any[]>([])
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [imagenesRotas, setImagenesRotas] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const supabase = createClient()

      const { data: subs } = await supabase
        .from('submissions')
        .select(`
          *,
          distributor:distributors(email, level, full_name, distributor_id)
        `)
        .order('created_at', { ascending: false })

      setSubmissions(subs || [])

      const { data: dists } = await supabase
        .from('distributors')
        .select('*')

      if (dists) {
        const distWithPoints = await Promise.all(dists.map(async (d) => {
          const { data: points } = await supabase
            .from('submissions')
            .select('points')
            .eq('distributor_id', d.id)
            .eq('status', 'approved')

          const total = points?.reduce((sum, p) => sum + (p.points || 0), 0) || 0
          return { ...d, totalPoints: total }
        }))
        setDistributors(distWithPoints)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar')
    }
  }

  const handleApprove = async (submissionId: string, points: number) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('submissions')
        .update({ status: 'approved', points })
        .eq('id', submissionId)

      if (err) throw err
      setEditingId(null)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al aprobar')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (submissionId: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase
        .from('submissions')
        .update({ status: 'rejected' })
        .eq('id', submissionId)

      if (err) throw err
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al rechazar')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const pendingSubmissions = submissions.filter(s => s.status === 'pending')

  const ordenados = [...distributors].sort((a, b) => b.totalPoints - a.totalPoints)
  const ganadores = ordenados.filter(d => d.totalPoints >= META_PUNTOS)
  const enCamino = ordenados.filter(d => d.totalPoints >= MEDIA_META && d.totalPoints < META_PUNTOS)

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Panel de Admin - Viaje Punta Cana</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        {error && (
          <div className="flex gap-2 rounded-md bg-red-50 p-3 text-sm text-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Distribuidores Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-600">{distributors.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Evidencias Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{pendingSubmissions.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Ganadores del Viaje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {ganadores.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">🎉 Ya alcanzaron la meta</CardTitle>
              <CardDescription>{META_PUNTOS} puntos o más · {ganadores.length} distribuidor(es)</CardDescription>
            </CardHeader>
            <CardContent>
              {ganadores.length === 0 ? (
                <p className="text-slate-500 text-sm">Todavía nadie llega a los {META_PUNTOS} puntos</p>
              ) : (
                <div className="space-y-2">
                  {ganadores.map((d) => (
                    <div key={d.id} className="flex justify-between items-center p-3 border rounded-lg bg-green-50 border-green-200">
                      <div>
                        <p className="font-medium text-sm">{d.full_name}</p>
                        <p className="text-xs text-slate-500">{d.distributor_id} • Nivel {d.level}</p>
                        <p className="text-xs text-slate-400">{d.email}</p>
                      </div>
                      <p className="font-bold text-lg text-green-600">{d.totalPoints} pts</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-700">📈 Más del 50% de avance</CardTitle>
              <CardDescription>Entre {MEDIA_META} y {META_PUNTOS - 1} puntos · {enCamino.length} distribuidor(es)</CardDescription>
            </CardHeader>
            <CardContent>
              {enCamino.length === 0 ? (
                <p className="text-slate-500 text-sm">Nadie pasa todavía de los {MEDIA_META} puntos</p>
              ) : (
                <div className="space-y-2">
                  {enCamino.map((d) => (
                    <div key={d.id} className="flex justify-between items-center p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                      <div>
                        <p className="font-medium text-sm">{d.full_name}</p>
                        <p className="text-xs text-slate-500">{d.distributor_id} • Nivel {d.level}</p>
                        <p className="text-xs text-slate-400">{d.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-yellow-600">{d.totalPoints} pts</p>
                        <p className="text-xs text-slate-500">faltan {META_PUNTOS - d.totalPoints}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribuidores y Puntos</CardTitle>
            <CardDescription>Resumen de puntos acumulados · {distributors.length} en total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {distributors.map((d) => {
                const getStatusColor = (points: number) => {
                  if (points >= META_PUNTOS) return 'bg-green-50 border-green-200'
                  if (points >= MEDIA_META) return 'bg-yellow-50 border-yellow-200'
                  return 'bg-slate-50 border-slate-200'
                }

                const getPointsColor = (points: number) => {
                  if (points >= META_PUNTOS) return 'text-green-600'
                  if (points >= MEDIA_META) return 'text-yellow-600'
                  return 'text-slate-900'
                }

                return (
                  <div key={d.id} className={`flex justify-between items-center p-3 border rounded-lg ${getStatusColor(d.totalPoints)}`}>
                    <div>
                      <p className="font-medium text-sm">{d.full_name}</p>
                      <p className="text-xs text-slate-500">{d.distributor_id} • Nivel {d.level}</p>
                      <p className="text-xs text-slate-400">{d.email}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${getPointsColor(d.totalPoints)}`}>
                        {d.totalPoints} pts
                      </p>
                      {d.totalPoints >= META_PUNTOS && (
                        <p className="text-xs text-green-600 font-semibold">✓ Ganador</p>
                      )}
                      {d.totalPoints >= MEDIA_META && d.totalPoints < META_PUNTOS && (
                        <p className="text-xs text-yellow-600">En camino</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏆 Clasificación de Puntos</CardTitle>
            <CardDescription>Top 10 de {distributors.length} distribuidores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-600 mb-3 pb-2 border-b">
                <div className="col-span-1">Pos.</div>
                <div className="col-span-4">Distribuidor</div>
                <div className="col-span-3">ID</div>
                <div className="col-span-2">Puntos</div>
                <div className="col-span-2">Estado</div>
              </div>
              {ordenados
                .slice(0, 10)
                .map((d, index) => {
                  const getStatusBadge = (points: number) => {
                    if (points >= META_PUNTOS) return { text: '🎉 Ganador', color: 'text-green-600' }
                    if (points >= MEDIA_META) return { text: '📈 En camino', color: 'text-yellow-600' }
                    return { text: '🚀 Iniciando', color: 'text-blue-600' }
                  }
                  const status = getStatusBadge(d.totalPoints)
                  return (
                    <div
                      key={d.id}
                      className={`grid grid-cols-12 gap-2 p-3 rounded-lg border ${
                        d.totalPoints >= META_PUNTOS ? 'bg-green-50 border-green-200' :
                        d.totalPoints >= MEDIA_META ? 'bg-yellow-50 border-yellow-200' :
                        'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="col-span-1 font-bold text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </div>
                      <div className="col-span-4">
                        <p className="font-semibold text-sm">{d.full_name}</p>
                      </div>
                      <div className="col-span-3">
                        <p className="text-xs text-slate-600">{d.distributor_id}</p>
                      </div>
                      <div className="col-span-2">
                        <p className={`font-bold ${
                          d.totalPoints >= META_PUNTOS ? 'text-green-600' :
                          d.totalPoints >= MEDIA_META ? 'text-yellow-600' :
                          'text-slate-900'
                        }`}>
                          {d.totalPoints}
                        </p>
                      </div>
                      <div className={`col-span-2 text-xs font-semibold ${status.color}`}>
                        {status.text}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evidencias Pendientes de Aprobación</CardTitle>
            <CardDescription>Revisa y aprueba/rechaza las evidencias</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingSubmissions.length === 0 ? (
              <p className="text-slate-500 text-sm">No hay evidencias pendientes</p>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((sub) => (
                  <div key={sub.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{sub.distributor?.full_name || 'Distribuidor'}</p>
                        <p className="text-xs text-slate-500">
                          {sub.distributor?.distributor_id || '-'} • Nivel {sub.level} • {new Date(sub.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-400">{sub.distributor?.email || '-'}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {imagenesRotas[sub.id] ? (
                        <div className="w-32 h-32 border rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-500 text-center px-2">
                          Imagen no disponible
                        </div>
                      ) : (
                        <div
                          className="border rounded-lg overflow-hidden bg-slate-100 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setModalImage(sub.image_url)}
                        >
                          <img
                            src={sub.image_url}
                            alt="Evidencia de compra"
                            className="w-32 h-32 object-cover"
                            onError={() => setImagenesRotas((prev) => ({ ...prev, [sub.id]: true }))}
                          />
                        </div>
                      )}
                      <p className="text-xs text-slate-500 flex items-center">
                        {imagenesRotas[sub.id] ? 'La evidencia no se subió correctamente' : 'Click para ver en grande'}
                      </p>
                    </div>

                    {editingId === sub.id ? (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="text-sm font-medium">Puntos (3 base + extras)</label>
                          <Input
                            type="number"
                            min="3"
                            value={editingPoints}
                            onChange={(e) => setEditingPoints(e.target.value)}
                            placeholder="3"
                          />
                          <p className="text-xs text-slate-500 mt-1">Mínimo 3 puntos (base). Agregar extras si lo merece.</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(sub.id, parseInt(editingPoints) || 3)}
                          disabled={loading}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingId(sub.id)
                            setEditingPoints('3')
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(sub.id)}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Decisiones</CardTitle>
            <CardDescription>Todas las evidencias procesadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {submissions.filter(s => s.status !== 'pending').map((sub) => (
                <div key={sub.id} className="flex justify-between items-center p-3 border rounded-lg text-sm">
                  <div>
                    <p className="font-medium">{sub.distributor?.full_name || 'Distribuidor'}</p>
                    <p className="text-xs text-slate-500">{sub.distributor?.distributor_id || '-'} • Nivel {sub.level}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.status === 'approved' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>+{sub.points} pts</span>
                      </div>
                    )}
                    {sub.status === 'rejected' && (
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Rechazado</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {modalImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setModalImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Evidencia de Compra</h3>
              <button
                onClick={() => setModalImage(null)}
                className="text-slate-500 hover:text-slate-700 text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-50 p-4">
              <img
                src={modalImage}
                alt="Evidencia de compra ampliada"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
