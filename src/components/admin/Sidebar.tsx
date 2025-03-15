import { Home, Plus, Server, Package, MessageSquare, FileText, Scroll, Menu as MenuIcon, X as XIcon, Users, Bell, Ticket, WrapText  } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/admin" },
  { title: "Add Service", icon: Plus, url: "/admin/add-service" },
  { title: "Services", icon: Server, url: "/admin/services" },
  { title: "Products", icon: Package, url: "/admin/products" },
  { title: "Users", icon: Users, url: "/admin/users" },
  { title: "Announcements", icon: Bell, url: "/admin/announcements" },
  { title: "Requests", icon: MessageSquare, url: "/admin/requests" },
  { title: "Invoices", icon: FileText, url: "/admin/invoices" },
  { title: "Coupons", icon: Ticket, url: "/admin/coupons" },
  { title: "Constants", icon: WrapText , url: "/admin/constants" },
  { title: "Logs", icon: Scroll, url: "/admin/logs" },
];

export function AdminSidebar() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarContent className="border-r border-border/30 dark:border-white/10 transition-all duration-300">
          <div className={`flex h-16 items-center ${state === 'collapsed' ? 'justify-center' : 'px-4'} justify-between border-b border-border/30 dark:border-white/10`}>
            <span className={`text-xl font-semibold text-black dark:text-gray-200 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              Admin Panel
            </span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer z-10 hidden lg:block"
            >
              {state === 'collapsed' ? (
                <MenuIcon className="h-6 w-6 text-icon" />
              ) : (
                <XIcon className="h-6 w-6 text-icon" />
              )}
            </button>
          </div>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.url}
                            className={`flex items-center py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-all duration-200 text-black dark:text-gray-200 hover:text-action group ${
                              state === 'collapsed' 
                                ? 'justify-center w-12 mx-auto' 
                                : 'px-4'
                            }`}
                          >
                            <item.icon className={`h-6 w-6 text-icon group-hover:text-action transition-colors ${state === 'collapsed' ? '' : 'mr-3'}`} />
                            <span className={`font-medium transition-all duration-200 ${state === 'collapsed' ? 'hidden' : 'block'}`}>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {state === 'collapsed' && (
                        <TooltipContent 
                          side="right" 
                          sideOffset={20}
                          className="z-[99999]"
                          forceMount
                        >
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
