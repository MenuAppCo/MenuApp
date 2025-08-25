import React from "react"

export function Container({ children }:{children: React.ReactNode}){
    return <div className="mx-auto max-w-screen-xl px-8 sm:px-12 lg:px-16">
        {children}
    </div>
}