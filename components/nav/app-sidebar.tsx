"use client"

import * as React from "react"
import {
  Frame,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav/nav-main"
import { NavProducts } from "@/components/nav/nav-projects"
import { NavUser } from "@/components/nav/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/nav/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Quản lý nhân viên",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Nhân viên",
          url: "/app/employees",
        },
        {
          title: "Phân quyền",
          url: "#",
        },
      ],
    },
  ],

  products: [
    {
      name: "Mua hàng",
      url: "#",
      icon: Frame,
    },
    {
      name: "Bán hàng",
      url: "/app/invoices",
      icon: PieChart,
    },
    {
      name: "Báo cáo",
      url: "#",
      icon: Map,
    },
    {
      name: "Sản phẩm",
      url: "/app/products",
      icon: SquareTerminal,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProducts products={data.products} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
