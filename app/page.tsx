import {AppSidebar} from "@/components/nav/app-sidebar";

import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/nav/sidebar";
import {Separator} from "@/components/ui/separator";
import React from "react";

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset"/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1"/>
          <Separator orientation="vertical" className="mr-2 h-4"/>
          {/* <Breadcrumb>
                <BreadcrumbList>
                  <  className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
        </header>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to MyKiot!</h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
