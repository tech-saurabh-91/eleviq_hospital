"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientNavbar from "@/components/layout/patient/PatientNavbar";
import { PatientSidebar } from "@/components/layout/patient/PatientSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/context/userContext";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoadingUser } = useUser();

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.replace("/signin");
    }
  }, [isLoadingUser, router, user]);

  if (isLoadingUser || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Checking your session...
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen flex-col">
        {/* Top Navbar */}
        <header className="fixed top-0 z-40 w-full">
          <PatientNavbar />
        </header>

        <div className="flex flex-1 pt-16 mx-auto ">
          {/* Sidebar */}
          <aside className="fixed top-14 left-0  h-[calc(100vh-4rem)] w-auto md:w-64 border-r  bg-white">
            <PatientSidebar />
          </aside>

          {/* Main content area */}
          <main className="flex-1 md:ml-64 p-4 bg-white  rounded-md min-h-[calc(100vh-4rem)]">
            <div className="mx-auto w-full  md:w-[1060px] ">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
