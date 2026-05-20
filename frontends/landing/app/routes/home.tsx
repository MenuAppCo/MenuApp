import type { Route } from "../routes/+types/home";
import { Hero } from "~/components/hero/hero";
import { Features } from "~/components/features/features";
import { Testimonials } from "~/components/testimonials/testimonials";
import { CTA } from "~/components/cta/cta";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "MenApp - El Menú Digital para tu Restaurante" },
    { 
      name: "description", 
      content: "Aumenta ventas, reduce costos y mejora la experiencia de clientes con MenApp. Menú digital inteligente para restaurantes en LATAM." 
    },
  ];
}

export default function Home() {
  return (
    <div className="flex flex-col bg-slate-950">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
}
