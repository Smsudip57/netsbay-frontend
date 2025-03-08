
import { Activity, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceStatusCardProps {
  status: string;
}

export const ServiceStatusCard = ({ status }: ServiceStatusCardProps) => {
  const isRunning = status === 'active';

  return (
    <Card className="relative h-[120px] w-full overflow-hidden bg-card border shadow-sm">
      <CardHeader className="relative p-3 pb-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className={cn(
            "h-4 w-4",
            isRunning ? "text-emerald-500" : "text-red-500"
          )} />
          <span className="text-foreground/80">Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className={cn(
          "flex items-center gap-2.5 p-3 rounded-lg",
          isRunning 
            ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" 
            : "bg-red-500/5 text-red-600 dark:text-red-400"
        )}>
          {isRunning ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">
            {isRunning ? "Running" : "Stopped"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
