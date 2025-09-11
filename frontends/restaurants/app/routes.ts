import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("./layouts/layout.tsx", [
    route("restaurants/:slug", "./routes/publicRestaurant.tsx"),
    route("restaurants/:slug/menus", "./routes/publicMenus.tsx"),
    route("restaurants/:slug/menu/:slug/:menuType", "./routes/publicMenu.tsx"),
    route("*", "./routes/not_found.tsx"),
  ]),
] satisfies RouteConfig;
