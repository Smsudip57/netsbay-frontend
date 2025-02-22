import { Home, BarChart3, ShoppingCart, Server, MessageSquare, Receipt, FileText, Settings, Menu as MenuIcon, X as XIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
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
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "Analytics", icon: BarChart3, url: "/dashboard/analytics" },
  { title: "Buy Service", icon: ShoppingCart, url: "/dashboard/buy-service" },
  { title: "Services", icon: Server, url: "/dashboard/services" },
  { title: "Requests", icon: MessageSquare, url: "/dashboard/requests" },
  { title: "Transactions", icon: Receipt, url: "/dashboard/transactions" },
  { title: "Invoices", icon: FileText, url: "/dashboard/invoices" },
  { title: "Toolkit", icon: Settings, url: "/dashboard/toolkit" },
];

export function DashboardSidebar() {
  const { toggleSidebar, state } = useSidebar();

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        <SidebarContent className="sidebar-content border-r border-border/30 dark:border-white/10 transition-all duration-300">
          <div className={`flex h-16 items-center ${state === 'collapsed' ? 'justify-center' : 'px-4'} justify-between border-b border-border/30 dark:border-white/10`}>
            <span className={`text-xl font-semibold text-black dark:text-gray-200 transition-all duration-200 ${state === 'collapsed' ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              Menu
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
