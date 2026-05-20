import { Container } from "~/components/container/container";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-20 pb-32 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10 opacity-30" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 opacity-30" />

      <Container>
        <div className="grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
          {/* Left content */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-medium text-orange-400">
                Solución #1 en LATAM
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-white">El menú digital</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  inteligente para tu restaurante
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
                Aumenta tus ventas, reduce costos operativos y mejora la experiencia de tus clientes con nuestra plataforma moderna y fácil de usar.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => window.location.href = 'https://admin.menapp.co/'}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-200 transform hover:scale-105">
                Comenzar Gratis
              </button>
              <button 
                onClick={() => window.location.href = 'https://menapp.co/restaurants/srojas-1754593120604'}
                className="px-8 py-4 border-2 border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold rounded-xl transition-all duration-200 bg-slate-800/50 backdrop-blur hover:bg-slate-800"
              >
                Ver Demo
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row gap-8 pt-8 border-t border-slate-800">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  5000+
                </p>
                <p className="text-sm text-slate-400">Restaurantes activos</p>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  500K+
                </p>
                <p className="text-sm text-slate-400">Orden procesadas</p>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  98%
                </p>
                <p className="text-sm text-slate-400">Satisfacción</p>
              </div>
            </div>
          </div>

          {/* Right visual - Illustration placeholder */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full h-96">
              {/* Phone mockup */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
                  {/* Phone screen content */}
                  <div className="absolute inset-3 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl flex flex-col p-4 space-y-4">
                    <div className="h-10 bg-gradient-to-r from-pink-500/30 to-indigo-500/30 rounded-lg" />
                    <div className="space-y-3 flex-1">
                      <div className="h-4 bg-slate-700/50 rounded w-3/4" />
                      <div className="h-4 bg-slate-700/50 rounded" />
                      <div className="h-4 bg-slate-700/50 rounded w-5/6" />
                    </div>
                    <div className="h-12 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-lg" />
                  </div>

                  {/* Glow effect */}
                  <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl" />
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
