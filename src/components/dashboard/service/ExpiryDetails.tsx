
import { Calendar, RefreshCw, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ExpiryDetailsProps {
  expiryDate: string;
  serviceId?: string;
  status?: string;
}

export const ExpiryDetails = ({ expiryDate, status = 'running' }: ExpiryDetailsProps) => {
  const isExpired = new Date(expiryDate) < new Date();
  const isRunning = status === 'running';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-lg",
          "backdrop-blur-xl border",
          isRunning 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 dark:bg-emerald-500/20"
            : "bg-red-500/10 border-red-500/20 text-red-400 dark:bg-red-500/20"
        )}>
          <Activity className="h-4 w-4" />
          <span className="text-sm font-medium">
            {isRunning ? "Running" : "Stopped"}
          </span>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Expires: {expiryDate}</span>
        </div>
      </div>

      {isExpired && (
        <Alert className="mb-6 bg-orange-500/10 dark:bg-orange-900/20 border-orange-500/20 dark:border-orange-900/30">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-orange-500">This service has expired. Please renew to continue using the service.</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 border-orange-500/50 hover:bg-orange-500/20 text-orange-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Renew Service
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
