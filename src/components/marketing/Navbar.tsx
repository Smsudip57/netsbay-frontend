import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { useAppContext } from "@/context/context";
import { useNavigate } from "react-router-dom";

export function MarketingNavbar() {
  const { theme, setTheme } = useTheme();
  const { user, loading, logout } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link
          to="/"
          className="flex items-center gap-2 group transition-all duration-300"
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

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="#features"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              to="#pricing"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              to="#faq"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
            <Link
              to="#contact"
              className="text-foreground/60 transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
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
          {!user && !loading ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <div
              className="bg-[#0F1729]"
              style={{ backgroundColor: "#0F1729", opacity: "1" }}
            >
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
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50"
                    onClick={() =>
                      navigate(
                        `/${user?.role === "user" ? "dashboard" : "admin"}`
                      )
                    }
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>
                      {user?.role === "admin" ? "Admin" : ""}Dashboard
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800/50">
                    <Key className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10 dark:text-[#cc0000]"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
