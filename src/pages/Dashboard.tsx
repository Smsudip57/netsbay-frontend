import { Routes, Route } from "react-router-dom";
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
  const { user, payment, transactions, getDate, services } = useAppContext();

  

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
              value={services?.length}
              icon={<Server className="h-4 w-4" />}
              description={`${
                services?.filter((service: any) => service?.status === "active")
                  ?.length
              } services running`}
              variant="default"
            />
            <StatsCard
              title="Available Balance"
              value={`${user?.balance.toFixed(2)} NC`}
              icon={<WalletIcon className="h-4 w-4" />}
              description={`Last topped up ${(() => {
                const data = payment?.filter(
                  (p: any) => p?.status === "Success"
                )?.[0]?.createdAt;
                return data ? moment(data).fromNow() : "never";
              })()}`}
              variant="default"
            />
            <StatsCard
              title="Resource Usage"
              value="75%"
              icon={<Activity className="h-4 w-4" />}
              description="Across all services"
              variant="default"
            />
            <StatsCard
              title="Total Storage"
              value={`${services
                ?.filter((service: any) => service?.status === "active")
                ?.reduce(
                  (acc: number, service: any) =>
                    acc + service?.relatedProduct?.storage,
                  0
                )} GB`}
              icon={<HardDrive className="h-4 w-4" />}
              description="250 GB available"
              variant="default"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
                      key={service.id}
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
                          service?.status === "active" ? "default" : "secondary"
                        }
                      >
                        {service?.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

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
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
