"use client"
import { Home, Calendar, User, Shield, AreaChartIcon as ChartArea, HelpCircle, User2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigationItems = [
  { href: "/patient", label: "Home", icon: Home },
  { href: "/patient/appointments", label: "Appointments", icon: Calendar },
  { href: "/patient/family-member", label: "Family Members", icon: User },
  { href: "/patient/insurance", label: "Insurance", icon: Shield },
  { href: "/patient/patient-chart", label: "Patient Chart", icon: ChartArea },
  { href: "/patient/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/patient/profile", label: "Profile", icon: User2 },
]

export function PatientSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="relative border-r border-gray-200  bg-white shadow-sm"
      style={{
        position: "relative",
        height: "100%",
        width: "var(--sidebar-width)",
      }}
    >
    

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-600">Patient Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="hover:bg-emerald-50 hover:text-emerald-600 data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-600"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs text-emerald-600/70 px-2 py-1">© 2025 OurPhoneMD</div>
      </SidebarFooter>
    </Sidebar>
  )
}