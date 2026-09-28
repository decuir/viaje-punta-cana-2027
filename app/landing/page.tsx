import { Button } from '@/components/ui/button'
import { CheckCircle, Award, Zap, Calendar, Target, Users } from 'lucide-react'
import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✈️</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sinergia Global</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  🏖️ Gana Tu Viaje a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Punta Cana</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Acumula 90 puntos y gana tu viaje all-inclusive a Punta Cana 2027. Es simple: compra, sube tu evidencia y ¡a disfrutar!
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/">
                  <Button size="lg" className="h-12 px-8 text-base">
                    Comienza Ahora
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Más Información
                </Button>
              </div>

            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-6xl font-bold">90</div>
                    <p className="text-lg opacity-90">Puntos para ganar</p>
                  </div>

                  <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm opacity-90">📦 3 puntos por cada paquete comprado</p>
                  </div>

                  <div className="text-center text-sm opacity-75">
                    Período: 28 sept - 21 dic 2026
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">¿Cómo funciona?</h3>
            <p className="text-xl text-slate-600 dark:text-slate-400">4 pasos simples para ganar tu viaje</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Compra',
                description: 'Compra tu paquete promocional',
                icon: '🛍️'
              },
              {
                step: '2',
                title: 'Sube tu Evidencia',
                description: 'Toma foto de tu recibo y súbelo',
                icon: '📸'
              },
              {
                step: '3',
                title: 'Aprobación',
                description: 'Nuestro equipo verifica tu compra',
                icon: '✅'
              },
              {
                step: '4',
                title: 'Gana Puntos',
                description: '3 puntos + bonos si aplican',
                icon: '⭐'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-6 h-full border border-blue-200 dark:border-slate-500">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">0{item.step}</div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Reglas del Concurso</h3>

              <div className="space-y-4">
                {[
                  { title: 'Meta', desc: 'Necesitas 90 puntos para ganar el viaje' },
                  { title: 'Puntos por Compra', desc: '3 puntos por cada paquete promocional' },
                  { title: 'Niveles', desc: 'Participa como Nivel 1 o Nivel 2' },
                  { title: 'Período', desc: '28 de septiembre - 21 de diciembre 2026' }
                ].map((rule, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-2xl">✓</div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{rule.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{rule.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Qué Incluye el Viaje</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li>🏨 Hotel all-inclusive</li>
                      <li>🍽️ Comidas y bebidas</li>
                      <li>🎉 Actividades incluidas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-4">
                  <Zap className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Próximas Fechas</h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li>📅 Inicio: 28 de Septiembre</li>
                      <li>🏁 Cierre: 21 de Diciembre</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-4xl font-bold text-white">¿Listo para participar?</h3>
            <p className="text-xl text-blue-100">Regístrate ahora y comienza a acumular puntos hacia tu viaje</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="h-12 px-8 bg-white text-blue-600 hover:bg-slate-100">
                Registrarse Ahora
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="h-12 px-8 border-white text-white hover:bg-white/10">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">© 2026 Sinergia Global. Viaje a Punta Cana 2027</p>
          <p className="text-sm">Términos y Condiciones • Política de Privacidad • Contacto</p>
        </div>
      </footer>
    </div>
  )
}
