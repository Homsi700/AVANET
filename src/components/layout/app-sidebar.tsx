'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, LayoutDashboard, Network } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    href: '/',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
  },
  {
    href: '/predict',
    label: 'التنبؤ بالمشاكل',
    icon: BrainCircuit,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="h-16 items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-10 w-10 p-2 text-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
            asChild
          >
            <Link href="/">
              <Network className="h-full w-full" />
            </Link>
          </Button>
          <h1 className="text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            AVA NET
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'left' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <div className="text-center text-xs text-sidebar-foreground/50">
          &copy; {new Date().getFullYear()} AVA NET.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
