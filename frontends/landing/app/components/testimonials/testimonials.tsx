import { Container } from "~/components/container/container";

const testimonials = [
  {
    name: "Carlos Rodríguez",
    role: "Dueño - La Casa del Asado",
    initials: "CR",
    content:
      "Desde que implementé MenApp, mis ventas aumentaron un 45%. La plataforma es intuitiva y el servicio al cliente es excepcional.",
    rating: 5,
    accentColor: "bg-orange-500",
  },
  {
    name: "María García",
    role: "Gerente - Pizzería Milano",
    initials: "MG",
    content:
      "El mejor Investment que hice. Ahora gestiono todo desde mi celular y mis clientes disfrutan la experiencia de pedir online.",
    rating: 5,
    accentColor: "bg-emerald-500",
  },
  {
    name: "Juan López",
    role: "Chef - Sushi Express",
    initials: "JL",
    content:
      "Herramienta increíble. Reducí el tiempo de preparación y los errores en las órdenes desaparecieron casi completamente.",
    rating: 5,
    accentColor: "bg-purple-500",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-20 sm:py-32 lg:py-40 bg-gradient-to-b from-slate-950 via-purple-900/20 to-slate-950"
    >
      {/* Background decorative */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <Container>
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24 space-y-4">
          <p className="text-emerald-400 font-semibold text-lg">Testimonios</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Confían en nosotros
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Descubre lo que dicen nuestros clientes sobre MenApp.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 backdrop-blur-sm"
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span
                    key={i}
                    className="text-amber-400 text-xl"
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-300 text-lg leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-slate-700/50">
                <div className={`w-14 h-14 rounded-full ${testimonial.accentColor} flex items-center justify-center text-white font-bold text-lg`}>
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-emerald-500/20 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
