import { Button } from '@/components/ui/button'
import Link from 'next/link'

const PASOS = [
  { icono: '🛍️', titulo: 'Compra', texto: 'Adquiere tu paquete promocional' },
  { icono: '📸', titulo: 'Sube tu evidencia', texto: 'Toma foto de tu recibo y súbelo' },
  { icono: '✅', titulo: 'Aprobación', texto: 'Verificamos tu compra' },
  { icono: '⭐', titulo: 'Suma puntos', texto: '3 puntos por cada paquete' },
]

const REGLAS = [
  { titulo: 'La meta', texto: '90 puntos para ganar el viaje' },
  { titulo: 'Cada paquete', texto: '3 puntos por paquete promocional' },
  { titulo: 'Niveles', texto: 'Participa como Nivel 1 o Nivel 2' },
  { titulo: 'Período', texto: 'Del 28 de septiembre al 21 de diciembre' },
]

const INCLUYE = [
  { icono: '🏨', titulo: 'Hotel all-inclusive', texto: 'Habitación y estancia cubiertas' },
  { icono: '🍹', titulo: 'Comidas y bebidas', texto: 'Todo incluido durante tu estancia' },
  { icono: '🎉', titulo: 'Actividades', texto: 'Experiencias y entretenimiento' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <style>{`
        @keyframes flotar { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-14px) } }
        @keyframes brillar { 0%,100% { opacity: .45 } 50% { opacity: .8 } }
        @keyframes vaiven { 0%,100% { transform: translateX(0) } 50% { transform: translateX(-24px) } }
        .flotar { animation: flotar 6s ease-in-out infinite }
        .brillar { animation: brillar 5s ease-in-out infinite }
        .vaiven { animation: vaiven 12s ease-in-out infinite }
        @media (prefers-reduced-motion: reduce) {
          .flotar, .brillar, .vaiven { animation: none }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌴</span>
            <span className="text-lg font-bold tracking-tight">Sinergia Global</span>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/">
              <Button className="bg-amber-400 font-semibold text-slate-900 hover:bg-amber-300">
                Registrarme
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Portada */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-900 via-teal-800 to-cyan-600" />
        <div className="brillar absolute -top-24 left-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-300/40 blur-3xl" />
        <div className="absolute right-10 top-16 -z-10 h-24 w-24 rounded-full bg-amber-200 shadow-[0_0_120px_60px_rgba(253,230,138,0.45)]" />

        <div className="mx-auto max-w-7xl px-4 pb-40 pt-20 sm:px-6 lg:px-8 lg:pb-52 lg:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
                ✈️ Concurso 2026 · Viaje 2027
              </span>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Tu próximo destino:
                <span className="mt-2 block bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                  Punta Cana
                </span>
              </h1>

              <p className="max-w-xl text-lg text-cyan-50/90 sm:text-xl">
                Arena blanca, mar turquesa y todo incluido. Acumula 90 puntos con tus
                paquetes promocionales y el viaje es tuyo.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/">
                  <Button size="lg" className="h-14 bg-amber-400 px-9 text-base font-bold text-slate-900 shadow-xl shadow-amber-500/25 hover:bg-amber-300">
                    Quiero participar
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button size="lg" variant="outline" className="h-14 border-white/40 bg-white/5 px-9 text-base text-white backdrop-blur hover:bg-white/15 hover:text-white">
                    Cómo funciona
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-2 text-sm text-cyan-50/80">
                <span>🏨 Hotel all-inclusive</span>
                <span>🍹 Comidas y bebidas</span>
                <span>🎉 Actividades</span>
              </div>
            </div>

            {/* Tarjeta de meta */}
            <div className="flotar relative mx-auto w-full max-w-sm">
              <div className="rounded-3xl border border-white/25 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/80">La meta</p>
                <p className="mt-3 bg-gradient-to-b from-white to-amber-200 bg-clip-text text-8xl font-black text-transparent">
                  90
                </p>
                <p className="text-lg font-medium text-cyan-50">puntos</p>

                <div className="mt-7 space-y-3 text-left">
                  <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">
                    📦 <span className="font-semibold">3 puntos</span> por cada paquete
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">
                    🏅 Participa como <span className="font-semibold">Nivel 1 o 2</span>
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">
                    📅 <span className="font-semibold">28 sept — 21 dic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Olas */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1440 220" preserveAspectRatio="none" className="vaiven h-32 w-[110%] sm:h-44" aria-hidden="true">
            <path fill="rgba(255,255,255,0.18)" d="M0,120 C240,190 480,40 720,100 C960,160 1200,60 1440,110 L1440,220 L0,220 Z" />
            <path fill="rgba(255,255,255,0.35)" d="M0,150 C260,210 520,90 780,140 C1040,190 1240,110 1440,150 L1440,220 L0,220 Z" />
            <path fill="rgb(2,6,23)" d="M0,185 C300,225 600,145 900,180 C1140,208 1300,175 1440,190 L1440,220 L0,220 Z" />
          </svg>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold sm:text-5xl">Cuatro pasos y listo</h2>
          <p className="mt-4 text-lg text-slate-400">Así de simple es acercarte al viaje</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map((paso, i) => (
            <div
              key={paso.titulo}
              className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-7 transition hover:border-amber-300/40 hover:from-amber-300/10"
            >
              <span className="absolute right-6 top-5 text-5xl font-black text-white/5 transition group-hover:text-amber-300/20">
                {i + 1}
              </span>
              <div className="text-4xl">{paso.icono}</div>
              <h3 className="mt-5 text-xl font-semibold">{paso.titulo}</h3>
              <p className="mt-2 text-sm text-slate-400">{paso.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reglas y qué incluye */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Las reglas</h2>
            <div className="mt-8 space-y-5">
              {REGLAS.map((regla) => (
                <div key={regla.titulo} className="flex gap-4">
                  <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-900">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold">{regla.titulo}</p>
                    <p className="text-sm text-slate-400">{regla.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Qué incluye</h2>
            <div className="mt-8 space-y-4">
              {INCLUYE.map((item) => (
                <div
                  key={item.titulo}
                  className="flex items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-teal-500/10 to-transparent p-5"
                >
                  <span className="text-3xl">{item.icono}</span>
                  <div>
                    <p className="font-semibold">{item.titulo}</p>
                    <p className="text-sm text-slate-400">{item.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Llamado final */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-600 via-cyan-600 to-sky-700" />
        <div className="brillar absolute -bottom-28 left-1/3 -z-10 h-80 w-80 rounded-full bg-amber-300/40 blur-3xl" />

        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-6xl">🏝️</p>
          <h2 className="mt-6 text-4xl font-black sm:text-5xl">Empieza a sumar hoy</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-cyan-50/90">
            Regístrate, sube tu primera evidencia y ve tu avance hacia los 90 puntos.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button size="lg" className="h-14 w-full bg-amber-400 px-10 text-base font-bold text-slate-900 shadow-xl hover:bg-amber-300 sm:w-auto">
                Registrarme ahora
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="h-14 w-full border-white/50 bg-white/10 px-10 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white sm:w-auto">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950 py-10 text-center text-sm text-slate-500">
        <p>© 2026 Sinergia Global · Viaje a Punta Cana 2027</p>
      </footer>
    </div>
  )
}
