// Calendario oficial de calificacion: 12 periodos semanales que arrancan el
// lunes 28 de septiembre de 2026. El codigo es el año mas la semana ISO, igual
// que en el calendario impreso (202640 a 202651).
export const INICIO_CAMPANA = new Date(2026, 8, 28)
export const TOTAL_PERIODOS = 12

export type Periodo = {
  semana: number
  codigo: string
  inicio: Date
  fin: Date
}

function sumarDias(fecha: Date, dias: number) {
  const copia = new Date(fecha)
  copia.setDate(copia.getDate() + dias)
  return copia
}

export const PERIODOS: Periodo[] = Array.from({ length: TOTAL_PERIODOS }, (_, i) => {
  const inicio = sumarDias(INICIO_CAMPANA, i * 7)
  return {
    semana: i + 1,
    codigo: `2026${40 + i}`,
    inicio,
    fin: sumarDias(inicio, 6),
  }
})

export function periodoDeFecha(fecha: Date | string | null | undefined) {
  if (!fecha) return null
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  if (Number.isNaN(d.getTime())) return null

  const dias = Math.floor((d.getTime() - INICIO_CAMPANA.getTime()) / 86400000)
  if (dias < 0) return null

  const indice = Math.floor(dias / 7)
  return PERIODOS[indice] ?? null
}

export function periodoActual(hoy: Date = new Date()) {
  return periodoDeFecha(hoy)
}

export function rangoLegible(p: Periodo) {
  const f = (d: Date) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  return `${f(p.inicio)} - ${f(p.fin)}`
}
