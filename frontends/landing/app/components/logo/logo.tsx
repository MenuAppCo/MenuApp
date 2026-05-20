import { Link } from "react-router";

export function Logo({ link = "/" }: { link?: string }){
    return  <Link className="block" to={link}>
    <span className="sr-only">Logo</span>
     <img src="/apple-touch-icon.png" alt="MenApp Logo" className="h-8 w-8" />
    </Link>
}