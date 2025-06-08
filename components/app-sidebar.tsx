"use client"

import * as React from "react"
import {
  Box, Contact,
  Frame,
  PieChart, Receipt,
  SquareTerminal,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader, SidebarMenu, SidebarMenuItem,
  SidebarRail, useSidebar,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/admin.jpg",
  },
  collapsibleItems: [
    {
      title: "Administration",
      url: "/pages/invoices",
      icon: SquareTerminal,
      items: [
        {
          title: "Quản lý nhân viên",
          url: "employees",
        },
        {
          title: "Phân quyền",
          url: "roles",
        },
      ],
    },
  ],
  normalItem: [
    {
      title: "Hóa đơn",
      url: "/pages/invoices",
      icon: Receipt,
    },
    {
      title: "Sản phẩm",
      url: "/pages/products",
      icon: Box,
    },
    {
      title: "Khách hàng",
      url: "/pages/customers",
      icon: Contact,
    },
  ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const {
    open,
  } = useSidebar()
  return (
    <Sidebar collapsible="icon" {...props} className="flex-shrink-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <a href="/" className="flex items-center gap-2">
                <Frame className={open ? "size-8" : "size-5"}/>
                {open && <span>MyKiot</span>}
              </a>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain collapsibleItems={data.collapsibleItems} normalItems={data.normalItem}/>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user}/>
      </SidebarFooter>

      <SidebarRail/>
    </Sidebar>
  );
}
