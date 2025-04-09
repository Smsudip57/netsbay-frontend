import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Moon,
  Sun,
  User,
  Key,
  LogOut,
  Info,
  AlertCircle,
  XCircle,
  CheckCircle,
  X,
  Trash2,
  Menu,
  WalletIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/context";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();
  const { notifications, setNotifications } = useAppContext();
  const { loading, user, logout, socket } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const clearNotification = (id: number) => {
    setNotifications(
      notifications?.filter((notification) => notification?.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getIcons = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "info":
        return <Info className="h-4 w-4 text-gray-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getBgColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/10";
      case "error":
        return "bg-red-500/10";
      case "info":
        return "bg-gray-500/10";
      case "warning":
        return "bg-yellow-500/10";
    }
  };
  // const getTextColor = (status: string) => {
  //   switch (status) {
  //     case "success":
  //       return "text-green-500";
  //     case "error":
  //       return "text-red-500";
  //     case "info":
  //       return "text-gray-500";
  //     case "warning":
  //       return "text-yellow-500";
  //   }
  // };

  const seenCount = notifications?.filter(
    (notification: any) => notification?.seen === true
  )?.length;

  useEffect(() => {
    const handleNotification = () => {
      if (notifications?.length - seenCount > 0 && isOpen && socket && user) {
        socket.emit("markNotificationsAsSeen", { userId: user?._id });
      }
    };

    handleNotification();
  }, [notifications, isOpen, socket, user, seenCount]);

  return (
    <header className="glass-card border-b border-border/30">
      <div className="flex h-16 items-center px-4 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden hover:bg-gray-200 dark:hover:bg-gray-800/50"
        >
          <Menu className="h-5 w-5 text-icon" />
        </Button>

        <Link
          to="/"
          className="flex items-center gap-2 mr-auto group transition-all duration-300"
        >
          <img
            src="/lovable-uploads/1b20afa1-1d7e-4040-aa41-ff6f23d99986.png"
            alt="NETBAY Logo"
            className="h-8 w-8 group-hover:scale-110 transition-transform duration-300 object-contain"
          />
          <span className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
            NETBAY
          </span>
        </Link>

        {/* Wallet Balance */}
        <Link
          to="/dashboard/wallet"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-200"
        >
          <WalletIcon className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm">{user?.balance} NC</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-gray-200 dark:hover:bg-gray-800/50"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-icon" />
            ) : (
              <Moon className="h-5 w-5 text-icon" />
            )}
          </Button>
          <DropdownMenu open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-200 dark:hover:bg-gray-800/50 relative"
              >
                <Bell className="h-5 w-5 text-icon" />
                {notifications?.length - seenCount > 0 && (
                  <span className="absolute top-1 right-0 text-[10px] p-[4px] leading-[4px] rounded-full bg-state-danger-light dark:bg-state-danger-dark">{notifications?.length - seenCount}</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 z-[100] max-h-[451px]"
            >
              <div className="flex items-center justify-between p-4">
                <DropdownMenuLabel className="font-normal p-0">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      {notifications?.length - seenCount} unread messages
                    </p>
                  </div>
                </DropdownMenuLabel>
                {notifications?.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div
                className="max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent scrollbar-thumb-red-500/50"
                style={{
                  scrollbarWidth: "thin",
                  msOverflowStyle: "none",
                  scrollbarColor: "#3676E0 transparent",
                }}
              >
                {notifications?.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications?.map((notification, index:number) => (
                    <DropdownMenuItem
                      key={`${index}`}
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-500/5 dark:hover:bg-gray-800/50"
                    >
                      <div
                        className={`rounded-full p-2 ${getBgColor(
                          notification?.status
                        )}`}
                      >
                        {getIcons(notification?.status)}
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <p className="text-sm font-medium">
                          {notification?.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification?.message}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearNotification(notification?.id);
                        }}
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer hover:opacity-80 transition-all rounded-full">
                <AvatarImage
                  src={
                    user?.profile?.avatarUrl !==
                    "https://default-avatar-url.com"
                      ? user?.profile?.avatarUrl
                      : "https://github.com/shadcn.png"
                  }
                  alt="User"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-[100]">
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50">
                <Key className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10 dark:text-[#cc0000]"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
