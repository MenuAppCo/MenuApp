import { type RouteConfig, index , layout, route} from "@react-router/dev/routes";

export default [
    layout("./layouts/layout.tsx", [
        index("./routes/home.tsx"),
        route("*", "./routes/not_found.tsx"),
      ]),
    

       

    ]satisfies RouteConfig;
