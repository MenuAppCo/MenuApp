import { Link } from "react-router";
import { Logo } from "../logo/logo";
import  type { JSX } from "react";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
  button?: JSX.Element;
};


export function SideBar({ isOpen, onClose, button}: SideBarProps) {
  return <div>
    {isOpen && (
  <div className="fixed inset-0 bg-black opacity-30 z-110" onClick={onClose} />
)}
    <div className= {`fixed right-0 top-0 h-full max-w-xs w-xs md:max-w-md md:w-md bg-gray-900 shadow-lg z-900  transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
<div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-gray-900 ">
  <div className="px-4 py-6">

    <div className="flex flex-row justify-between align-items-center">
      <div className=" h-10 w-32 bg-gray-900">
        <Logo/>
      </div>

    <a href="#" onClick={onClose} className="flex flex-col items-center justify-center text-center"> 
      <svg className="size-6 text-white"          
            fill="currentColor"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
      </svg>
      <label className="mt-1 text-xs text-white">Cerrar</label>
      </a>
    </div>
   
    
    <ul className="mt-6 space-y-6">
      <li>
        <Link to="/#como_funciona" onClick={onClose}>
          <a className="text-white transition hover:text-gray-500/75"> Demo </a>
        </Link>   
      </li>
      <li>
        <Link to="/#contactanos" onClick={onClose}>
          <a className="text-white transition hover:text-gray-500/75"> Contactanos </a>
        </Link>   
      </li>
      <li>
        <Link to="/#tarifas" onClick={onClose}>
          <a className="text-white transition hover:text-gray-500/75"> Tarifas </a>
        </Link>   
      </li>
      <div className="w-full" onClick={onClose}>
            {button === undefined ?  "" : button}
      </div>

    </ul>
  </div>
</div>

  </div> 
  </div>
}