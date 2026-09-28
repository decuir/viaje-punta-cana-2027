'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LogOut, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export function AdminDashboard({ user }: { user: any }) {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingPoints, setEditingPoints] = useState('')
  const [distributors, setDistributors] = useState<any[]>([])

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
                {distributors.filter(d => d.totalPoints >= 90).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Distribuidores y Puntos</CardTitle>
            <CardDescription>Resumen de puntos acumulados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {distributors.map((d) => {
                const getStatusColor = (points: number) => {
                  if (points >= 90) return 'bg-green-50 border-green-200'
                  if (points > 50) return 'bg-yellow-50 border-yellow-200'
                  return 'bg-slate-50 border-slate-200'
                }

                const getPointsColor = (points: number) => {
                  if (points >= 90) return 'text-green-600'
                  if (points > 50) return 'text-yellow-600'
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
                      {d.totalPoints >= 90 && (
                        <p className="text-xs text-green-600 font-semibold">✓ Ganador</p>
                      )}
                      {d.totalPoints > 50 && d.totalPoints < 90 && (
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
            <CardTitle>🏆 Leaderboard de Puntos</CardTitle>
            <CardDescription>Ranking de distribuidores</CardDescription>
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
              {[...distributors]
                .sort((a, b) => b.totalPoints - a.totalPoints)
                .map((d, index) => {
                  const getStatusBadge = (points: number) => {
                    if (points >= 90) return { text: '🎉 Ganador', color: 'text-green-600' }
                    if (points > 50) return { text: '📈 En camino', color: 'text-yellow-600' }
                    return { text: '🚀 Iniciando', color: 'text-blue-600' }
                  }
                  const status = getStatusBadge(d.totalPoints)
                  return (
                    <div
                      key={d.id}
                      className={`grid grid-cols-12 gap-2 p-3 rounded-lg border ${
                        d.totalPoints >= 90 ? 'bg-green-50 border-green-200' :
                        d.totalPoints > 50 ? 'bg-yellow-50 border-yellow-200' :
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
                          d.totalPoints >= 90 ? 'text-green-600' :
                          d.totalPoints > 50 ? 'text-yellow-600' :
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

                    <div className="border rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={sub.image_url}
                        alt="Evidencia de compra"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23475569" text-anchor="middle" dominant-baseline="middle"%3EImagen no disponible%3C/text%3E%3C/svg%3E'
                        }}
                      />
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
    </div>
  )
}
