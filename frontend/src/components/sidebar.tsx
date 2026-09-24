"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MdDashboard } from "react-icons/md";
import { IoIosWallet } from "react-icons/io";
import { MdRestaurantMenu } from "react-icons/md";
import { BiSolidFoodMenu } from "react-icons/bi";

import { useLogout } from "@/hooks/auth.hook";
import { useAuthStore } from "@/stores/auth.store";

export default function SidebarApp() {
  const pathname = usePathname();
  const { mutateAsync: logout, isPending } = useLogout();
  const { admin } = useAuthStore();

  const sideMenu = [
    {
      group: "Dashboard",
      items: [{ title: "Dashboard", href: "/dashboard", icon: MdDashboard }],
    },
    {
      group: "Orders",
      items: [
        {
          title: "All Orders",
          href: "/orders/all-orders",
          icon: IoIosWallet,
        },
        {
          title: "Pending Orders",
          href: "/orders/pending-orders",
          icon: IoIosWallet,
        },
      ],
    },
    {
      group: "Menu",
      items: [{ title: "Menu", href: "/menu-product", icon: MdRestaurantMenu }],
    },
    {
      group: "Categories",
      items: [
        { title: "Categories", href: "/categories", icon: BiSolidFoodMenu },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
  };
  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex flex-col gap-0 border-b">
          <div className="px-2">
            <h1 className="text-2xl font-bold">Menu Shop</h1>
            <p>
              Welcome back <span className="font-bold">{admin?.name}</span>
            </p>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-4 flex flex-col gap-4 py-4">
          {sideMenu.map((menu, i) => (
            <div key={i} className="flex flex-col gap-2">
              <span className="font-bold">{menu.group}</span>

              {menu.items.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className={`py-1 ${pathname === item.href ? "text-blue-800 bg-blue-100 px-4 py-1 rounded-2xl" : "text-black hover:scale-100 duration-300 hover:bg-blue-50 hover:px-4 hover:py-1 hover:rounded-2xl"}`}
                >
                  <span className="flex gap-2 items-center">
                    <item.icon />
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          ))}
        </SidebarContent>
        <SidebarFooter className="px-4 py-4">
          <Button onClick={handleLogout}>
            {isPending ? "Loading..." : "Logout"}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
