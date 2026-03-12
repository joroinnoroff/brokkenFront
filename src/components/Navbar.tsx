"use client";
import { CalendarDays, FileText, Instagram, Music } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
 
import { useEffect, useState } from "react";

export default function Navbar() {
   const [active, setActive] = useState(0);
   const pathname = usePathname();

   useEffect(() => {
    const activeLink = links.findIndex(link => link.href === pathname);
    setActive(activeLink);
   }, [pathname]);
    const links = [
        {
            label: "Records",
            href: "/records",
            icon: Music,
        },
        {
            label: "Events",
            href: "/events",
            icon: CalendarDays,
        },
        {
            label: "Terms",
            href: "/terms",
            icon: FileText,
        },
        {
            label: "Instagram",
            href: "/",
            icon: Instagram,
        }
    ]
  

    return (
        <nav className="flex lg:flex-row flex-col items-center justify-between px-8 py-2">
            <Link href={"/"}>
            <div className=" uppercase">
            <h1 className="font-[Pinocchio] text-7xl"
             
            >
              Brokken Records
            </h1>
          </div>
            </Link>


           <div className="links flex lg:flex-col flex-row my-5 gap-5 lg:gap-4">
            {links.filter(link => link.label !== "Terms")
                .map((link, idx) => (
                    <Link
                      href={link.href}
                      key={idx}
                      className={`flex items-center gap-2 rounded-md px-3 py-1.5 cursor-pointer transition-colors text-xs lg:text-lg ${
                        active === idx
                          ? "bg-primary/10 text-primary"
                          : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                      }`}
                    >
                        <span>{link.icon && <link.icon className="w-6 h-6" />}</span>
                        <p>{link.label}</p>
                    </Link>
                ))}


                
           </div>
        </nav>
    )
}