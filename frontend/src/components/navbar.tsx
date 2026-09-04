"use client";

import { GoHomeFill } from "react-icons/go";
import { FaShoppingCart } from "react-icons/fa";
import { IoIosWallet } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const menuNav = [
    { name: "Home", href: "/menu", icon: GoHomeFill },
    { name: "Cart", href: "/cart", icon: FaShoppingCart },
    { name: "Order", href: "/order", icon: IoIosWallet },
    { name: "History", href: "/history", icon: FaHistory },
  ];
  return (
    <>
      <nav className="fixed bottom-0 w-full z-50 px-4 py-4 bg-black">
        <div className="flex items-center justify-between px-4">
          {menuNav.map((menu, i) => (
            <Link key={i} href={menu.href}>
              <div className="flex flex-col gap-1 items-center justify-center">
                <menu.icon
                  size={19}
                  className={`${pathname === menu.href ? "text-white/70" : "text-white"}`}
                />
                <p
                  className={`text-[9px] ${pathname === menu.href ? "text-white/70" : "text-white"}`}
                >
                  {menu.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
