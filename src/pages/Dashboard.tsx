import { Routes, Route, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import Analytics from "./dashboard/Analytics";
import BuyService from "./dashboard/BuyService";
import Services from "./dashboard/Services";
import ServiceDetails from "./dashboard/ServiceDetails";
import Requests from "./dashboard/Requests";
import Transactions from "./dashboard/Transactions";
import Invoices from "./dashboard/Invoices";
import Wallet from "./dashboard/Wallet";
import Toolkit from "./dashboard/Toolkit";
import PurchaseNetcoins from "./dashboard/PurchaseNetcoins";
import ProductPurchase from "./dashboard/ProductPurchase";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/context";
import ProfilePage from "./ProfilePage";
import {
  Cpu,
  HardDrive,
  Activity,
  Server,
  Wallet as WalletIcon,
  Receipt,
  Plus,
  ArrowRight,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

const mockServices = [
  { id: 1, name: "Ubuntu Server", status: "online", type: "Linux" },
  { id: 2, name: "Windows VPS", status: "stopped", type: "Windows" },
  { id: 3, name: "CentOS Server", status: "online", type: "Linux" },
];

const mockTransactions = [
  { id: 1, type: "Purchase", amount: "200 NC", date: "2024-03-01" },
  { id: 2, type: "Service Payment", amount: "-50 NC", date: "2024-02-28" },
  { id: 3, type: "Refund", amount: "25 NC", date: "2024-02-27" },
];

const DashboardHome = () => {
  const {
    user,
    payment,
    transactions,
    getDate,
    services,
    announcements: announcement,
  } = useAppContext();

  const getPriorityColor = (date: Date, status: boolean) => {
    const currentDate = new Date();
    const givenDate = new Date(date);
    const diffTime = currentDate.getTime() - givenDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Determine priority based on date age
    let priority: string;
    if (diffDays < 5) {
      priority = "Latest";
    }
    if (status) {
      return priority;
    }
    switch (priority) {
      case "Latest":
        return "bg-yellow-50 border dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30";
      // case "medium":
      // return "bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30";
      // default:
      //   return "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
    }
  };
  return (
    <main className="p-6 flex-1">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-muted-foreground">
                Here's what's happening with your services.
              </p>
            </div>
            <Button asChild>
              <Link
                to="/dashboard/buy-service"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Service
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Active Services"
              value={
                services?.filter(
                  (service: any) =>
                    service?.status === "active" &&
                    service?.ipAddress &&
                    service?.password &&
                    service?.username
                )?.length
              }
              icon={<Server className="h-4 w-4" />}
              description={`${
                services?.filter(
                  (service: any) =>
                    service?.status === "active" &&
                    service?.ipAddress &&
                    service?.password &&
                    service?.username
                )?.length
              } services running`}
              variant="default"
            />
            <StatsCard
              title="Available Balance"
              value={`${user?.balance.toFixed(2)} NC`}
              icon={<WalletIcon className="h-4 w-4" />}
              description={`Last topped up ${(() => {
                const data = payment?.filter(
                  (p: any) => p?.status === "Success" && p?.user?._id === user?._id
                )?.[0]?.createdAt;
                return data ? moment(data).fromNow() : "never";
              })()}`}
              variant="default"
            />
            <StatsCard
              title="Total Sales"
              value={`${Math.abs(transactions?.filter(
                (transaction: any) => transaction?.amount < 0 && transaction?.user === user?._id
              )?.reduce((acc: number, transaction: any) => acc + transaction?.amount, 0) || 0)} NC`}
              icon={<Activity className="h-4 w-4" />}
              description="Across all transactions"
              variant="default"
            />
            <StatsCard
              title="Total Storage"
              value={`${services
                ?.filter((service: any) => service?.status === "active" &&
                service?.ipAddress &&
                service?.password &&
                service?.username)
                ?.reduce(
                  (acc: number, service: any) =>
                    acc + service?.relatedProduct?.storage,
                  0
                )} GB`}
              icon={<HardDrive className="h-4 w-4" />}
              description="Across all active services"
              variant="default"
            />
          </div>
        </div>
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-medium">
                Latest Announcement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Card
                key={announcement?.[0]?._id}
                className="hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">
                      {announcement?.[0]?.subject}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {getDate(announcement?.[0]?.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(
                      announcement?.[0]?.createdAt,
                      false
                    )} `}
                  >
                    {getPriorityColor(announcement?.[0]?.createdAt, true)}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {announcement?.[0]?.body}
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        <div
          className={`grid gap-6   ${
            services?.filter((service: any) => {
              const expiryTimestamp =
                typeof service?.expiryDate === "string"
                  ? new Date(service.expiryDate).getTime()
                  : service?.expiryDate;

              return expiryTimestamp > Date.now();
            })?.length > 0 && transactions?.length > 0
              ? "md:grid-cols-2"
              : ""
          }`}
        >
          {services?.filter((service: any) => {
            const expiryTimestamp =
              typeof service?.expiryDate === "string"
                ? new Date(service.expiryDate).getTime()
                : service?.expiryDate;

            return expiryTimestamp > Date.now();
          })?.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Active Services
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/dashboard/services"
                    className="flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div
                  className="space-y-4 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent "
                  style={{
                    scrollbarWidth: "thin",
                    msOverflowStyle: "none",
                    scrollbarColor: "#3676E0 transparent",
                  }}
                >
                  {services
                    ?.filter((service: any) => {
                      const expiryTimestamp =
                        typeof service?.expiryDate === "string"
                          ? new Date(service.expiryDate).getTime()
                          : service?.expiryDate;

                      return expiryTimestamp > Date.now();
                    })
                    ?.slice(0, 10)
                    ?.map((service: any) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Server className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {service?.serviceNickname}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {service?.relatedProduct?.Os}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            service?.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {service?.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
          {transactions?.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">
                  Recent Activity
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link
                    to="/dashboard/transactions"
                    className="flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div
                  className="space-y-4 max-h-[240px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent scrollbar-thumb-red-500/50"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#3676E0 transparent",
                    msOverflowStyle: "none",
                  }}
                >
                  {transactions?.slice(0, 10)?.map((transaction: any) => (
                    <div
                      key={transaction?.transactionId}
                      className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {transaction?.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getDate(transaction?.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={
                          transaction?.amount < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {transaction?.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                asChild
              >
                <Link to="/dashboard/wallet">
                  <WalletIcon className="h-5 w-5" />
                  <span>Add Funds</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                asChild
              >
                <Link to="/dashboard/requests">
                  <Bell className="h-5 w-5" />
                  <span>Support Requests</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                asChild
              >
                <Link to="/dashboard/toolkit">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Security Tools</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                asChild
              >
                <Link to="/dashboard/invoices">
                  <Receipt className="h-5 w-5" />
                  <span>Billing History</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const Dashboard = () => {
  const { user, loading } = useAppContext();
  const navigate = useNavigate();

  if (!loading && !user) {
    navigate("/signin", { replace: true });
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="buy-service" element={<BuyService />} />
            <Route path="buy-service/purchase" element={<ProductPurchase />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetails />} />
            <Route path="requests" element={<Requests />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="toolkit" element={<Toolkit />} />
            <Route path="purchase-netcoins" element={<PurchaseNetcoins />} />
            <Route path="profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
