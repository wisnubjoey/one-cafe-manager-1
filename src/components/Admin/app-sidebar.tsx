"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Coffee,
  CalendarCheck,
  CalendarDots,
  ClipboardText,
  File,
  GearSix,
  House,
  Receipt,
  SignOut,
  SquaresFour,
  Users,
} from "@phosphor-icons/react"

import { authClient } from "@/lib/auth-client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: House,
  },
  {
    title: "Menu",
    url: "/admin/menu",
    icon: ClipboardText,
    isClosed: true,
  },
  {
    title: "Absen",
    url: "/admin/absen",
    icon: CalendarCheck,
    isClosed: true,
  },
  {
    title: "Scheduled Absen",
    url: "/admin/scheduled-absen",
    icon: CalendarDots,
    isClosed: true,
  },
  {
    title: "Member",
    url: "/admin/member",
    icon: Users,
    isClosed: true,
  },
  {
    title: "Purchase Invoice",
    url: "/admin/purchase-invoice",
    icon: Receipt,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: GearSix,
    isClosed: true,
  },
  {
    title: "Blank",
    url: "/admin/blank",
    icon: File,
  },
]

function isActivePath(pathname: string, url: string) {
  if (url === "/admin") {
    return pathname === url
  }

  return pathname === url || pathname.startsWith(`${url}/`)
}

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        },
      },
    })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="One Cafe Manager">
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center bg-sidebar-primary text-sidebar-primary-foreground">
                  <Coffee className="size-4" weight="fill" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">
                    One Cafe Manager
                  </span>
                  <span className="truncate text-xs text-sidebar-foreground/70">
                    Admin panel
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                      <SidebarMenuItem
                        key={item.title}
                        className={item.isClosed ? "cursor-not-allowed" : undefined}
                      >
                        {item.isClosed ? (
                          <SidebarMenuButton
                            disabled
                            aria-disabled="true"
                            className="cursor-not-allowed opacity-60 pr-14"
                            tooltip={`${item.title} (Closed)`}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                  </SidebarMenuButton>
                  ) : (
                  <SidebarMenuButton
                    asChild
                    isActive={isActivePath(pathname, item.url)}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  )}
                  {item.isClosed && (
                    <SidebarMenuBadge className="text-muted-foreground text-[10px] tracking-wider uppercase font-semibold">
                      Closed
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Workspace">
              <SquaresFour />
              <span>Admin Workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut} tooltip="Sign out">
              <SignOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
