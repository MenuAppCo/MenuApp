import { Container } from "~/components/container/container";

const features = [
  {
    icon: "□",
    title: "Menú Digital Inteligente",
    description:
      "Crea y actualiza tu menú en segundos. Organiza por categorías, añade fotos y precios con facilidad.",
    gradient: "from-orange-500/20 to-red-600/10",
    border: "border-orange-500/30",
    accentColor: "text-orange-400",
  },
  {
    icon: "⚡",
    title: "Órdenes en Tiempo Real",
    description:
      "Recibe pedidos directamente en tu celular. Notificaciones instantáneas para nunca perder una orden.",
    gradient: "from-yellow-500/20 to-amber-600/10",
    border: "border-yellow-500/30",
    accentColor: "text-yellow-400",
  },
  {
    icon: "◆",
    title: "Pagos Seguros",
    description:
      "Integración con todos los métodos de pago. Cobra en línea sin comisiones adicionales.",
    gradient: "from-teal-500/20 to-cyan-600/10",
    border: "border-teal-500/30",
    accentColor: "text-teal-400",
  },
  {
    icon: "▲",
    title: "Analytics Avanzados",
    description:
      "Visualiza tus ventas, productos más vendidos y métricas clave para crecer.",
    gradient: "from-purple-500/20 to-violet-600/10",
    border: "border-purple-500/30",
    accentColor: "text-purple-400",
  },
  {
    icon: "◎",
    title: "Diseño Personalizable",
    description:
      "Branding 100% personalizado. Refleja la identidad de tu restaurante en tu menú.",
    gradient: "from-rose-500/20 to-pink-600/10",
    border: "border-rose-500/30",
    accentColor: "text-rose-400",
  },
  {
    icon: "◈",
    title: "Acceso Global",
    description:
      "Tus clientes pueden acceder desde cualquier dispositivo, en cualquier lugar.",
    gradient: "from-lime-500/20 to-green-600/10",
    border: "border-lime-500/30",
    accentColor: "text-lime-400",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="relative py-20 sm:py-32 lg:py-40 bg-slate-950 overflow-hidden"
    >
      {/* Background decorative */}
      <div className="absolute top-1/3 -left-96 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-96 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <Container>
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24 space-y-4">
          <p className="text-orange-400 font-semibold text-lg">Características</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Todo lo que necesitas para triunfar
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Una plataforma completa con todas las herramientas para gestionar tu restaurante
            exitosamente.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`relative group p-8 rounded-2xl border border-slate-800 bg-gradient-to-br ${feature.gradient} ${feature.border} transition-all duration-300 hover:border-opacity-100 hover:shadow-xl hover:shadow-slate-900/50 cursor-pointer`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 space-y-4">
                {/* Icon */}
                <div className={`text-4xl font-bold ${feature.accentColor}`}>{feature.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>

                {/* Arrow indicator */}
                <div className={`pt-4 flex items-center gap-2 ${feature.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                  <span className="text-sm font-semibold">Más</span>
                  <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* Border animation on hover */}
              <div className={`absolute inset-0 rounded-2xl border border-transparent group-hover:${feature.border} transition-colors duration-300`} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
