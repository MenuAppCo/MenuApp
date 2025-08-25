import { Outlet } from "react-router";
import { Footer } from "~/components/footer/footer";
import { NavBar } from "~/components/navbar/navbar";

export default function Layout() {
    return <>
    <NavBar sticky={true} button={              <a
                className="block rounded-sm border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:ring-3 focus:outline-hidden"
                href="#"
              >
                Iniciar
              </a>}/>
        <Outlet />
    <Footer />
    </>
}