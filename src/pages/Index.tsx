import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, ArrowUpRight, BarChart3, Download, Upload, RefreshCw, Info, AlertCircle, XCircle, CheckCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import type { ReactNode } from 'react';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const Index = () => {
  const { toast } = useToast();

  const showToast = (type: 'info' | 'warning' | 'danger' | 'success', message: string) => {
    const icons = {
      info: <Info className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />,
      danger: <XCircle className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />
    };

    const styles = {
      info: "bg-state-info-light dark:bg-state-info-dark text-white",
      warning: "bg-state-warning-light dark:bg-state-warning-dark text-white",
      danger: "bg-state-danger-light dark:bg-state-danger-dark text-white",
      success: "bg-state-success-light dark:bg-state-success-dark text-white"
    };

    toast({
      title: (
        <div className="flex items-center gap-2">
          {icons[type]}
          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
        </div>
      ) as string & ReactNode,
      description: message,
      className: styles[type]
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col lg:flex-row">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-4 lg:p-6 space-y-6 lg:space-y-8">
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-gray-100/50">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-muted-foreground">Here's what's happening today.</p>
            </div>
            
            <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Revenue"
                value="$45,231.89"
                icon={<DollarSign className="h-4 w-4" />}
                description="+20.1% from last month"
                variant="default"
              />
              <StatsCard
                title="Active Users"
                value="2,350"
                icon={<Users className="h-4 w-4" />}
                description="+180 new users"
                variant="default"
              />
              <StatsCard
                title="Conversion Rate"
                value="3.2%"
                icon={<ArrowUpRight className="h-4 w-4" />}
                description="Increased by 1.2%"
                variant="default"
              />
              <StatsCard
                title="Active Projects"
                value="12"
                icon={<BarChart3 className="h-4 w-4" />}
                description="3 projects in review"
                variant="default"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl lg:text-2xl font-semibold">System States</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  className="w-full bg-state-info-light hover:bg-state-info-dark dark:bg-state-info-dark dark:hover:brightness-110 text-white transition-all"
                  onClick={() => showToast("info", "This is an informational message")}
                >
                  <Info className="mr-2 h-4 w-4" />
                  Info State
                </Button>
                <Button
                  className="w-full bg-state-warning-light hover:bg-state-warning-dark dark:bg-state-warning-dark dark:hover:brightness-110 text-white transition-all"
                  onClick={() => showToast("warning", "Warning: Action required")}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Warning State
                </Button>
                <Button
                  className="w-full bg-state-danger-light hover:bg-state-danger-dark dark:bg-state-danger-dark dark:hover:brightness-110 text-white transition-all"
                  onClick={() => showToast("danger", "Error: Operation failed")}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Danger State
                </Button>
                <Button
                  className="w-full bg-state-success-light hover:bg-state-success-dark dark:bg-state-success-dark dark:hover:brightness-110 text-white transition-all"
                  onClick={() => showToast("success", "Success: Operation completed")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Success State
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-gray-100/50 bg-white/50 backdrop-blur-sm p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <h2 className="text-xl lg:text-2xl font-semibold">Analytics Overview</h2>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    className="relative overflow-hidden text-white border-none shadow-lg before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#1a90ff,#0050b3)] dark:before:bg-[linear-gradient(135deg,#33C3F0,#0FA0CE)] hover:before:brightness-110 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      <Download className="mr-2 h-4 w-4" /> Export
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="relative overflow-hidden text-white border-none shadow-lg before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#722ed1,#4c2889)] dark:before:bg-[linear-gradient(135deg,#9b87f5,#0EA5E9)] hover:before:brightness-110 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      <Upload className="mr-2 h-4 w-4" /> Import
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="relative overflow-hidden text-white border-none shadow-lg before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#08979c,#006d75)] dark:before:bg-[linear-gradient(135deg,#10B981,#0EA5E9)] hover:before:brightness-110 transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </span>
                  </Button>
                </div>
              </div>

              <div className="h-[300px] lg:h-[400px] w-full rounded-lg bg-card/30 backdrop-blur-sm border border-border">
                <ChartContainer
                  config={{
                    line: {
                      theme: {
                        light: "#ff33ff",
                        dark: "#ff33ff"
                      }
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4c1d95" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4c1d95" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        className="stroke-muted/20"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', opacity: 0.6 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'currentColor', opacity: 0.6 }}
                        dx={-10}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                        cursor={{
                          stroke: 'currentColor',
                          strokeOpacity: 0.2,
                          strokeWidth: 1,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#ff33ff"
                        strokeWidth={2}
                        fillOpacity={0.8}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;