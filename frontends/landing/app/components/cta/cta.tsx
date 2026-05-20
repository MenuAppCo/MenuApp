import { Container } from "~/components/container/container";

export function CTA() {
  return (
    <section
      id="cta"
      className="relative py-20 sm:py-32 lg:py-40 bg-slate-950 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full blur-3xl opacity-10" />
      </div>

      <Container>
        <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto">
          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
              <span className="text-white">¿Listo para</span>
              <br />
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                transformar tu negocio?
              </span>
            </h2>

            <p className="text-xl text-slate-300 leading-relaxed">
              Únete a miles de restaurantes que ya están creciendo con MenApp.
              La primera 2 semanas son completamente gratis.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={() => window.location.href = 'https://admin.menapp.co/'}
              className="px-10 py-5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-2xl shadow-teal-500/40 transition-all duration-200 transform hover:scale-105">
              Prueba Gratis Ahora
            </button>
            <button className="px-10 py-5 border-2 border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold text-lg rounded-xl transition-all duration-200 bg-slate-800/50 backdrop-blur hover:bg-slate-800">
              Hablar con un Experto
            </button>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              { icon: "•", text: "Sin tarjeta de crédito", color: "text-orange-400" },
              { icon: "•", text: "Configuración en 5 minutos", color: "text-emerald-400" },
              { icon: "•", text: "Soporte 24/7", color: "text-purple-400" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 justify-center md:justify-start"
              >
                <span className={`text-2xl ${item.color}`}>{item.icon}</span>
                <span className="text-slate-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
