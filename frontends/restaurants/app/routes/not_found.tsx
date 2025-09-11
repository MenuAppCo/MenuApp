import type { Route } from "./+types/not_found";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "No encontrado" },
    { name: "description", content: "No encontrado" },
  ];
}

export default function NotFound() {
  return <>"NOT FOUND"</>;
}
