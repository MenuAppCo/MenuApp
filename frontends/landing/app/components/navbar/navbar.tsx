import { useState, type JSX } from "react";
import { Logo } from "../logo/logo";
import { SideBar } from "../sidebar/sidebar";
import { Link } from "react-router";

export function NavBar({button=undefined, className="", sticky=false}:{button?: JSX.Element, className?: string, sticky?: boolean}) {
  const [isSidebarOpen, setIsSidebarOpen]= useState(false)

    return <header className={`bg-gray-900 z-100 ${className} ${sticky === true ? "sticky top-0" : ""}`}>
    <SideBar button={button} isOpen={isSidebarOpen} onClose={()=> {setIsSidebarOpen(false)}} />
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        <div className="md:flex md:items-center md:gap-12">
          <Logo />
        </div>
        <div className="hidden md:block">
          <nav aria-label="Global">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link to="/#demo"> 
                  <a className="text-white transition hover:text-gray-500/75"> Demo </a>
                </Link>
              </li>
              <li>
                <Link to="/#preguntas_frecuentes"> 
                  <a className="text-white transition hover:text-gray-500/75"> Contactanos </a>
                </Link>
              </li>
              <li>
                <Link to="/#tarifas"> 
                  <a className="text-white transition hover:text-gray-500/75"> Tarifas </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="sm:flex sm:gap-4 hidden md:block">
            {button === undefined ?  "" : button}
          </div>

          <button
            className="block rounded-sm bg-indigo-600 p-2.5 text-white transition hover:text-gray-600/75 md:hidden"
            onClick={()=>{setIsSidebarOpen(!isSidebarOpen)}}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
}