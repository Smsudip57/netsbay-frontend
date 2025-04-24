import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Routes, Route } from "react-router-dom";
import AddService from "./AddService";
import AdminServices from "./AdminServices";
import AdminProducts from "./AdminProducts";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import AdminUsers from "./AdminUsers";
import UserDetails from "./UserDetails";
import UserInvoices from "./UserInvoices";
import AdminAnnouncements from "./AdminAnnouncements";
import AdminRequests from "./AdminRequests";
import AdminInvoices from "./AdminInvoices";
import AdminLogs from "./AdminLogs";
import AdminConstants from "./AdminConstants";
import Coupons from "./Coupons";
import AddCoupon from "./AddCoupon";
import AddCoinCoupon from "./AddCoinCoupon";
import ServiceDetails from "../dashboard/ServiceDetails";
import { useAppContext } from "@/context/context";
import { useNavigate } from "react-router-dom";
import Profile from "@/pages/ProfilePage";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  DatabaseIcon,
  DollarSign,
  HardDrive,
  Server,
  StarIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
// Helper functions to extract out repeated logic
const isToday = (dateStr: string | Date) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isThisMonth = (dateStr: string | Date) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

const isThisYear = (dateStr: string | Date) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return date.getFullYear() === today.getFullYear();
};

const DashboardHome = () => {
  const [services, setMockServices] = useState<any[]>([]);
  const { requests, setRequests, payment } = useAppContext();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch requests, services and transactions
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch requests if needed
        if (requests?.length === 0 || !requests) {
          const reqResponse = await axios.get("/api/admin/requests", {
            withCredentials: true,
          });
          if (reqResponse?.data) {
            setRequests(reqResponse.data);
          }
        }
        
        // Fetch services if needed
        if (services.length === 0) {
          const servResponse = await axios.get("/api/admin/services", {
            withCredentials: true,
          });
          if (servResponse?.data) {
            setMockServices(servResponse.data);
          }
        }
        
        // Fetch transactions if needed
        if (transactions.length === 0) {
          const txnResponse = await axios.get("/api/admin/transactions", {
            withCredentials: true,
          });
          if (txnResponse?.data) {
            setTransactions(txnResponse.data);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setIsLoading(false);
        toast.error("Failed to load some dashboard data");
      }
    };
    
    fetchAllData();
  }, []);

  // Calculate transaction stats
  const internalTodayCount = transactions?.filter(t => 
    t?.planId?.serviceType?.includes("Internal") && isToday(t?.createdAt)
  )?.length || 0;
  
  const exclusiveTodayCount = transactions?.filter(t => 
    t?.planId?.serviceType?.includes("External") && isToday(t?.createdAt)
  )?.length || 0;
  
  const internalMonthCount = transactions?.filter(t => 
    t?.planId?.serviceType?.includes("Internal") && isThisMonth(t?.createdAt)
  )?.length || 0;
  
  const exclusiveMonthCount = transactions?.filter(t => 
    t?.planId?.serviceType?.includes("External") && isThisMonth(t?.createdAt)
  )?.length || 0;
  
  const internalYearCount = transactions?.filter(t => 
    t?.planId?.serviceType?.includes("Internal") && isThisYear(t?.createdAt)
  )?.length || 0;
  
  const exclusiveYearCount = transactions?.filter(t => 
    t?.planId?.serviceType?.includes("External") && isThisYear(t?.createdAt)
  )?.length || 0;

  // Get correct days in current month for accurate percentage
  const daysInCurrentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();

  if (isLoading) {
    return (
      <div className="p-6 flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex-1">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 text-center">
          <h2 className="text-lg font-medium text-red-800 dark:text-red-300">Error Loading Dashboard</h2>
          <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
          <button
            className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 text-sm font-medium rounded-md hover:bg-red-200 dark:hover:bg-red-800"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 flex-1">
      {/* Services Overview Section */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-100/50">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <StatsCard
            title="Active Services"
            value={`${
              services?.filter(
                service => service?.status === "active" &&
                service?.ipAddress &&
                service?.password &&
                service?.username
              )?.length || 0
            }`}
            icon={<Server className="h-4 w-4" />}
            description={`${services?.length ? 
              ((services?.filter(s => s?.status === "active").length / services.length) * 100).toFixed(1) : 0}% of all services`}
            variant="default"
          />

          <StatsCard
            title="Expired Services"
            value={`${
              services?.filter(service => service?.status === "expired")
                ?.length || 0
            }`}
            icon={<ClockIcon className="h-4 w-4" />}
            description={`${
              services?.filter(
                s =>
                  s?.status === "expired" &&
                  new Date(s.expiryDate) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              )?.length || 0
            } in the last 7 days`}
            variant="danger"
          />

          <StatsCard
            title="Expiring Today"
            value={`${
              services?.filter(service => {
                if (!service?.expiryDate) return false;
                return service.status === "active" && isToday(service.expiryDate);
              })?.length || 0
            }`}
            icon={<AlertTriangleIcon className="h-4 w-4" />}
            description="Requires immediate attention"
            variant="warning"
          />

          <StatsCard
            title="Resource Usage"
            value={`${services
              ?.filter(service => service?.status === "active")
              ?.reduce(
                (acc, service) => acc + (service?.relatedProduct?.storage || 0),
                0
              )} GB`}
            icon={<DatabaseIcon className="h-4 w-4" />}
            description={`Across ${
              services?.filter(service => service?.status === "active")
                ?.length || 0
            } active services`}
            variant="default"
          />
        </div>
      </div>

      {/* Quick Navigation Section */}
      <div className="mt-4 sm:mt-6">
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <CardTitle className="text-xl font-bold">Administrative Controls</CardTitle>
              <span className="text-xs text-muted-foreground">Quick access to key areas</span>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {/* Service Management */}
              <div
                className="group relative overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md cursor-pointer"
                onClick={() => navigate("/admin/services")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-4 sm:p-6 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Server className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                      {services?.filter(service => service?.status === "active")?.length || 0} active
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-1">Service Management</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Add, configure and manage all active and pending services
                  </p>
                  <div className="flex justify-end">
                    <span className="text-sm text-blue-600 dark:text-blue-400 group-hover:underline flex items-center">
                      Manage
                      <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Management */}
              <div
                className="group relative overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md cursor-pointer"
                onClick={() => navigate("/admin/products")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-4 sm:p-6 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <HardDrive className="h-5 sm:h-6 w-5 sm:w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                      Catalog
                    </span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-1">Product Management</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Configure pricing, features and availability of products
                  </p>
                  <div className="flex justify-end">
                    <span className="text-sm text-green-600 dark:text-green-400 group-hover:underline flex items-center">
                      Manage
                      <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Management */}
              <div
                className="group relative overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md cursor-pointer"
                onClick={() => navigate("/admin/requests")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-4 sm:p-6 cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 sm:h-12 w-10 sm:w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <AlertCircleIcon className="h-5 sm:h-6 w-5 sm:w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    {requests?.filter(request => request.status === "Pending")?.length > 0 && (
                      <span className="animate-pulse text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-full">
                        {requests?.filter(request => request.status === "Pending")?.length || 0} pending
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base sm:text-lg mb-1">
                    Request Management
                    {requests?.filter(request => request.status === "Pending")?.length > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 rounded-full">
                        {requests?.filter(request => request.status === "Pending")?.length || 0}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    Review and process user service requests and support tickets
                  </p>
                  <div className="flex justify-end">
                    <span className="text-sm text-amber-600 dark:text-amber-400 group-hover:underline flex items-center">
                      Manage
                      <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics Section */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-100/50 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">Sales Analytics</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span> Internal
            <span className="inline-block w-3 h-3 bg-purple-500 rounded-full ml-3 mr-1"></span> External
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
          <StatsCard
            title="Today's Sales"
            value={
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Internal:</span>
                  </div>
                  <span className="font-bold">{internalTodayCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">External:</span>
                  </div>
                  <span className="font-bold">{exclusiveTodayCount}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-1 border-t">
                  <span className="text-sm font-semibold">Total:</span>
                  <div className="flex items-center">
                    <span className="font-bold text-lg">{internalTodayCount + exclusiveTodayCount}</span>
                    {(internalTodayCount + exclusiveTodayCount) > 0 && 
                      <span className={`text-xs ml-2 px-1.5 py-0.5 rounded-sm ${
                        (internalTodayCount + exclusiveTodayCount) > 5 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {(internalTodayCount + exclusiveTodayCount) > 5 ? 'On Target' : 'Below Target'}
                      </span>
                    }
                  </div>
                </div>
              </div>
            }
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
            variant="default"
            description={`${
              internalMonthCount + exclusiveMonthCount > 0 ?
              ((internalTodayCount + exclusiveTodayCount) / (internalMonthCount + exclusiveMonthCount) * 100).toFixed(1) : 
              "0.0"
            }% of month's sales`}
          />

          <StatsCard
            title="This Month's Sales"
            value={
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Internal:</span>
                  </div>
                  <span className="font-bold">{internalMonthCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">External:</span>
                  </div>
                  <span className="font-bold">{exclusiveMonthCount}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-1 border-t">
                  <span className="text-sm font-semibold">Total:</span>
                  <div className="flex items-baseline">
                    <span className="font-bold text-lg">{internalMonthCount + exclusiveMonthCount}</span>
                    <span className="text-xs text-muted-foreground ml-1">/ 75 target</span>
                  </div>
                </div>
                {/* Progress bar for monthly target */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, ((internalMonthCount + exclusiveMonthCount) / 75) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            }
            icon={<ClockIcon className="h-5 w-5 text-blue-600" />}
            variant="default"
            description={`${Math.round((new Date().getDate() / daysInCurrentMonth) * 100)}% of month completed`}
          />

          <StatsCard
            title="This Year's Sales"
            value={
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">Internal:</span>
                  </div>
                  <span className="font-bold">{internalYearCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    <span className="text-sm font-medium">External:</span>
                  </div>
                  <span className="font-bold">{exclusiveYearCount}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-1 border-t">
                  <span className="text-sm font-semibold">Total:</span>
                  <span className="font-bold text-lg">{internalYearCount + exclusiveYearCount}</span>
                </div>
                {/* Year over year comparison */}
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className="text-muted-foreground">Previous:</span>
                  <div className="flex items-center">
                    <span>750</span>
                    <span className="ml-1 text-green-600 flex items-center">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      {(((internalYearCount + exclusiveYearCount) / 750) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            }
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
            variant="default"
            description={`Avg ${Math.round((internalYearCount + exclusiveYearCount) / Math.max(1, new Date().getMonth() + 1))} sales per month`}
          />
        </div>

        {/* Additional Insights Row */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Conversion Rate</h3>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">68%</div>
            <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-1">Percentage of visitors who complete a purchase</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30">
            <h3 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">Revenue Growth</h3>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">+34%</div>
            <p className="text-xs text-green-700/70 dark:text-green-400/70 mt-1">Compared to previous month</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800/30">
            <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">Most Popular</h3>
            <div className="text-xl font-bold text-purple-700 dark:text-purple-400">VPS Pro</div>
            <p className="text-xs text-purple-700/70 dark:text-purple-400/70 mt-1">Accounts for 42% of all sales</p>
          </div>
        </div> */}
      </div>

      {/* Financial Analytics Section */}
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-gray-100/50 mt-4 sm:mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center">
            <span className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3 hidden sm:block"></span>
            <h2 className="text-xl sm:text-2xl font-bold">Financial Analytics</h2>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 py-1 px-3 rounded-full text-sm font-medium">
            <span className="text-xs text-muted-foreground">Financial Year 2025</span>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {/* Today's Revenue Card */}
          <StatsCard
            title="Today's Revenue"
            value={
              <div className="space-y-2">
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-bold mr-1">₹</span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {payment
                      ?.filter(t => 
                        isToday(t?.createdAt) && 
                        t?.status === "Success" && 
                        t.paymentType !== "Cryptomous"
                      )
                      ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                      .toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-bold mr-1">$</span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {payment
                      ?.filter(t => 
                        isToday(t?.createdAt) && 
                        t?.status === "Success" && 
                        t.paymentType === "Cryptomous"
                      )
                      ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                      .toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            }
            icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
            variant="default"
            description={
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-xs text-muted-foreground">From {payment?.filter(t => isToday(t?.createdAt) && t?.status === "Success").length || 0} transactions</span>
                <div className="flex gap-2">
                  <span className="text-xs font-medium text-blue-600">₹ {payment?.filter(t => isToday(t?.createdAt) && t?.status === "Success" && t.paymentType !== "Cryptomous").length || 0}</span>
                  <span className="text-xs font-medium text-green-600">$ {payment?.filter(t => isToday(t?.createdAt) && t?.status === "Success" && t.paymentType === "Cryptomous").length || 0}</span>
                </div>
              </div>
            }
          />

          {/* Monthly Revenue Card */}
          <StatsCard
            title="Month-to-Date Revenue"
            value={
              <div className="flex flex-col">
                <div className="flex items-baseline mb-2">
                  <span className="text-xl sm:text-2xl font-bold mr-1">₹</span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {payment
                      ?.filter(t => 
                        isThisMonth(t?.createdAt) && 
                        t?.status === "Success" && 
                        t.paymentType !== "Cryptomous"
                      )
                      ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                      .toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-baseline mb-2">
                  <span className="text-xl sm:text-2xl font-bold mr-1">$</span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {payment
                      ?.filter(t => 
                        isThisMonth(t?.createdAt) && 
                        t?.status === "Success" && 
                        t.paymentType === "Cryptomous"
                      )
                      ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                      .toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-1">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(100, (new Date().getDate() / daysInCurrentMonth) * 100)}%` }}
                  ></div>
                </div>
              </div>
            }
            icon={<CalendarIcon className="h-5 w-5 text-blue-600" />}
            variant="default"
            description={
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{Math.round((new Date().getDate() / daysInCurrentMonth) * 100)}% of month completed</span>
                <div className="flex gap-2 text-xs font-medium">
                  <span className="text-blue-600">₹ {payment?.filter(t => isThisMonth(t?.createdAt) && t?.status === "Success" && t.paymentType !== "Cryptomous").length}</span>
                  <span className="text-green-600">$ {payment?.filter(t => isThisMonth(t?.createdAt) && t?.status === "Success" && t.paymentType === "Cryptomous").length}</span>
                </div>
              </div>
            }
          />

          {/* Annual Revenue Card */}
          <StatsCard
            title="Year-to-Date Revenue"
            value={
              <div className="space-y-2">
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-bold mr-1">₹</span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {payment
                      ?.filter(t => 
                        isThisYear(t?.createdAt) && 
                        t?.status === "Success" && 
                        t.paymentType !== "Cryptomous"
                      )
                      ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                      .toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-bold mr-1">$</span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {payment
                      ?.filter(t => 
                        isThisYear(t?.createdAt) && 
                        t?.status === "Success" && 
                        t.paymentType === "Cryptomous"
                      )
                      ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                      .toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            }
            icon={<ChartBarIcon className="h-5 w-5 text-purple-600" />}
            variant="default"
            description={
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Q1 (₹):</span>
                  <span>{payment
                    ?.filter(t => 
                      isThisYear(t?.createdAt) && 
                      new Date(t.createdAt).getMonth() < 3 && 
                      t?.status === "Success" && 
                      t.paymentType !== "Cryptomous"
                    )
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Q1 ($):</span>
                  <span>{payment
                    ?.filter(t => 
                      isThisYear(t?.createdAt) && 
                      new Date(t.createdAt).getMonth() < 3 && 
                      t?.status === "Success" && 
                      t.paymentType === "Cryptomous"
                    )
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Q2 (₹):</span>
                  <span>{payment
                    ?.filter(t => 
                      isThisYear(t?.createdAt) && 
                      new Date(t.createdAt).getMonth() >= 3 && 
                      new Date(t.createdAt).getMonth() < 6 && 
                      t?.status === "Success" && 
                      t.paymentType !== "Cryptomous"
                    )
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Q2 ($):</span>
                  <span>{payment
                    ?.filter(t => 
                      isThisYear(t?.createdAt) && 
                      new Date(t.createdAt).getMonth() >= 3 && 
                      new Date(t.createdAt).getMonth() < 6 && 
                      t?.status === "Success" && 
                      t.paymentType === "Cryptomous"
                    )
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}</span>
                </div>
              </div>
            }
          />
        </div>

        {/* Payment Method Distribution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {/* Phonepe Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200/50 dark:border-purple-800/30 flex items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3 text-purple-600 dark:text-purple-400">
              <span className="font-bold text-sm sm:text-base">PE</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-purple-900 dark:text-purple-300">PhonePe</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-400 mr-1">₹</span>
                <span className="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-400">
                  {payment
                    ?.filter(t => t?.status === "Success" && t.paymentType === "Phonepe")
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Stripe Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200/50 dark:border-green-800/30 flex items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3 text-green-600 dark:text-green-400">
              <span className="font-bold text-sm sm:text-base">ST</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-green-900 dark:text-green-300">Stripe</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400 mr-1">₹</span>
                <span className="text-base sm:text-lg font-bold text-green-700 dark:text-green-400">
                  {payment
                    ?.filter(t => t?.status === "Success" && t.paymentType === "Stripe")
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Crypto Card */}
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200/50 dark:border-yellow-800/30 flex items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mr-3 text-amber-600 dark:text-amber-400">
              <span className="font-bold text-sm sm:text-base">CR</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-300">Crypto</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-400 mr-1">$</span>
                <span className="text-base sm:text-lg font-bold text-amber-700 dark:text-amber-400">
                  {payment
                    ?.filter(t => t?.status === "Success" && t.paymentType === "Cryptomous")
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Bank Transfer */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-800/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-800/30 flex items-center">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
              <span className="font-bold text-sm sm:text-base">BT</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300">Bank Transfer</h3>
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-400 mr-1">₹</span>
                <span className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-400">
                  {payment
                    ?.filter(t => t?.status === "Success" && t.paymentType === "Bank_Transfer")
                    ?.reduce((acc, t) => acc + (t?.Price || 0), 0)
                    .toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const AdminDashboard = () => {
  const { user, loading } = useAppContext();
  const navigate = useNavigate();

  if (!loading && user?.role !== "admin") {
    navigate("/dashboard", { replace: true });
  }
  if (loading || user?.role !== "admin") {
    return <></>;
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="services/:id" element={<ServiceDetails />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="users/:id/invoices" element={<UserInvoices />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="requests/:id" element={<ServiceDetails />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="coupons/add" element={<AddCoupon />} />
            <Route path="coupons/add-coin" element={<AddCoinCoupon />} />
            <Route path="constants" element={<AdminConstants />} />
            <Route path="logs" element={<AdminLogs />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
