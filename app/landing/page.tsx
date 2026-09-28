import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const DATOS = [
  { valor: '90', etiqueta: 'puntos para ganar' },
  { valor: '3', etiqueta: 'puntos por paquete' },
  { valor: '12', etiqueta: 'semanas para calificar' },
]

const PASOS = [
  { icono: '🛍️', titulo: 'Compra', texto: 'Adquiere tu paquete promocional' },
  { icono: '📸', titulo: 'Sube tu evidencia', texto: 'Toma foto de tu recibo y súbelo' },
  { icono: '✅', titulo: 'Aprobación', texto: 'Verificamos tu compra' },
  { icono: '⭐', titulo: 'Suma puntos', texto: '3 puntos por cada paquete' },
]

const REGLAS = [
  { titulo: 'La meta', texto: '90 puntos para ganar el viaje' },
  { titulo: 'Cada paquete', texto: '3 puntos por paquete promocional' },
  { titulo: 'Tipo de compra', texto: 'Paquete propio, Nivel 1 o Nivel 2' },
  { titulo: 'Período', texto: 'Del 28 de septiembre al 21 de diciembre' },
]

const INCLUYE = [
  { icono: '🏨', titulo: 'Hotel all-inclusive', texto: 'Habitación y estancia cubiertas' },
  { icono: '🍹', titulo: 'Comidas y bebidas', texto: 'Todo incluido durante tu estancia' },
  { icono: '🎉', titulo: 'Actividades', texto: 'Experiencias y entretenimiento' },
]

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-sky-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="text-lg font-black leading-none tracking-tight">
            <span className="text-blue-900">SINERGIA</span>{' '}
            <span className="text-red-600">GLOBAL</span>
          </p>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/">
              <Button variant="ghost" className="text-blue-900 hover:bg-sky-100">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-red-600 font-semibold text-white hover:bg-red-700">
                Registrarme
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Portada con el arte oficial de la campaña */}
      <section className="bg-gradient-to-b from-sky-400 via-sky-200 to-sky-50 px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-2xl shadow-2xl shadow-blue-900/25 ring-4 ring-white sm:rounded-3xl">
            <Image
              src="/banner-punta-cana.webp"
              alt="Por primera vez en la historia Sinergia Global hace un viaje de playa internacional: Punta Cana te espera"
              width={1431}
              height={786}
              preload
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="h-auto w-full"
            />
          </div>

          <div className="mt-10 text-center">
            <p className="mx-auto max-w-2xl text-lg text-slate-700 sm:text-xl">
              Arena blanca, mar turquesa y todo incluido. Acumula{' '}
              <strong className="text-blue-900">90 puntos</strong> con tus paquetes promocionales
              y el viaje es tuyo.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/">
                <Button
                  size="lg"
                  className="h-14 w-full bg-red-600 px-10 text-base font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-700 sm:w-auto"
                >
                  Quiero participar
                </Button>
              </Link>
              <a href="#como-funciona">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-full border-2 border-blue-900 bg-white px-10 text-base font-semibold text-blue-900 hover:bg-blue-50 sm:w-auto"
                >
                  Cómo funciona
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {DATOS.map((d) => (
              <div
                key={d.etiqueta}
                className="rounded-2xl border-b-4 border-amber-400 bg-white px-6 py-7 text-center shadow-md"
              >
                <p className="text-5xl font-black text-blue-900">{d.valor}</p>
                <p className="mt-1 text-sm font-medium uppercase tracking-wide text-slate-500">
                  {d.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-black text-blue-900 sm:text-5xl">Cuatro pasos y listo</h2>
          <p className="mt-3 text-lg text-slate-600">Así de simple es acercarte al viaje</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso, i) => (
            <div
              key={paso.titulo}
              className="relative rounded-2xl border border-sky-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="absolute right-5 top-4 text-5xl font-black text-sky-100">{i + 1}</span>
              <div className="text-4xl">{paso.icono}</div>
              <h3 className="mt-5 text-xl font-bold text-blue-900">{paso.titulo}</h3>
              <p className="mt-2 text-sm text-slate-600">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reglas y qué incluye */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-black text-blue-900 sm:text-4xl">Las reglas</h2>
            <div className="mt-8 space-y-5">
              {REGLAS.map((regla) => (
                <div key={regla.titulo} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-blue-900">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">{regla.titulo}</p>
                    <p className="text-sm text-slate-600">{regla.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-black text-blue-900 sm:text-4xl">Qué incluye</h2>
            <div className="mt-8 space-y-4">
              {INCLUYE.map((item) => (
                <div
                  key={item.titulo}
                  className="flex items-start gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-5"
                >
                  <span className="text-3xl">{item.icono}</span>
                  <div>
                    <p className="font-bold text-slate-900">{item.titulo}</p>
                    <p className="text-sm text-slate-600">{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Llamado final */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/playa-punta-cana.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-950/55 via-blue-900/35 to-blue-950/70" />
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] sm:px-6 sm:py-32 lg:px-8">
          <p className="text-6xl">🏝️</p>
          <h2 className="mt-5 text-4xl font-black sm:text-5xl">
            Punta Cana <span className="text-amber-300">te espera</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-sky-100">
            Regístrate, sube tu primera evidencia y ve tu avance hacia los 90 puntos.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button
                size="lg"
                className="h-14 w-full bg-amber-400 px-10 text-base font-bold text-blue-900 hover:bg-amber-300 sm:w-auto"
              >
                Registrarme ahora
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full border-2 border-white bg-transparent px-10 text-base font-semibold text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-blue-950 py-10 text-center text-sm text-sky-200/70">
        <p>© 2026 Sinergia Global · Tiempo, salud y riqueza</p>
      </footer>
    </div>
  )
}
