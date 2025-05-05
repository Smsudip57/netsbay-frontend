import { ServerIcon, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DatacenterValue {
  location: string;
  datastore: string;
  status: boolean;
}

interface ServiceStatusCardProps {
  status: boolean;
  value: DatacenterValue;
}

export default function ServiceDataCenter({ status, value }: ServiceStatusCardProps) {
  return (
    <Card className={cn(
      "relative h-[120px] w-full overflow-hidden bg-card border shadow-sm",
      status ? "border-l-emerald-500" : "border-l-red-500"
    )}>
      <div />
      
      <CardHeader className="relative p-4">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <ServerIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground font-semibold">Data Center</span>
          <span className={cn(
            "ml-auto text-xs px-2 py-0.5 rounded-full font-medium",
            status 
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          )}>
            {status ? "Active" : "Inactive"}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {/* Single line content with all key information */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium">{value.location}</span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium">{value.datastore}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Activity className={cn(
              "h-3 w-3",
              status ? "text-emerald-500 animate-pulse" : "text-red-500"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}