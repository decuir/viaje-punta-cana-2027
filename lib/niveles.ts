// El tipo de compra se guarda en submissions.level. El 0 es "paquete propio",
// que no es un nivel de la red sino una compra para uso personal.
export const PAQUETE_PROPIO = 0

export const OPCIONES_NIVEL = [
  { valor: '0', etiqueta: 'Paquete propio' },
  { valor: '1', etiqueta: 'Nivel 1' },
  { valor: '2', etiqueta: 'Nivel 2' },
]

export function etiquetaNivel(nivel: number | null | undefined) {
  const opcion = OPCIONES_NIVEL.find((o) => o.valor === String(nivel))
  return opcion ? opcion.etiqueta : `Nivel ${nivel}`
}
