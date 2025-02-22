
import { Server, Calendar, Cpu, HardDrive, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceDetailsCardProps {
  details: {
    expiryDate: string;
    cpu: string;
    ram: string;
    storage: string;
    ipSet: string;
    id: string;
  };
  status: string;
}

export const ServiceDetailsCard = ({ details, status }: ServiceDetailsCardProps) => {
  const isRunning = status === 'running';
  
  const detailItems = [
    { 
      icon: Calendar, 
      label: "Expiry Date", 
      value: details.expiryDate,
      highlight: true 
    },
    { icon: Cpu, label: "CPU", value: details.cpu },
    { icon: Server, label: "RAM", value: details.ram },
    { icon: HardDrive, label: "Storage", value: details.storage },
    { icon: Globe, label: "IP Set", value: details.ipSet },
    { 
      icon: Server, 
      label: "Product ID", 
      value: details.id,
      highlight: true 
    },
  ];

  return (
    <Card className="mb-4 dark:bg-slate-900/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-1.5 dark:text-slate-200">
            <Server className="h-4 w-4" />
            Service Details
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isRunning ? "bg-emerald-500" : "bg-red-500"
            )} />
            <span className={cn(
              "text-sm font-medium",
              isRunning ? "text-emerald-400" : "text-red-400"
            )}>
              {isRunning ? "Running" : "Stopped"}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {detailItems.map((detail, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-2 p-2.5 rounded-lg border",
                detail.highlight 
                  ? "dark:bg-white/5 dark:border-white/10" 
                  : "dark:bg-slate-900/30 dark:border-slate-800/50"
              )}
            >
              <div className={cn(
                "mt-0.5",
                detail.highlight 
                  ? "dark:text-blue-400" 
                  : "dark:text-slate-400"
              )}>
                <detail.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className={cn(
                  "text-xs font-medium",
                  detail.highlight 
                    ? "dark:text-blue-400" 
                    : "dark:text-slate-400"
                )}>
                  {detail.label}
                </p>
                <p className={cn(
                  "text-sm font-medium",
                  detail.highlight 
                    ? "dark:text-blue-400" 
                    : "dark:text-slate-300"
                )}>
                  {detail.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
