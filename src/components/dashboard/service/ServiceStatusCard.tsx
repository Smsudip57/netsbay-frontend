
import { Activity, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";


type ServiceType =
  | "Internal RDP"
  | "External RDP"
  | "Internal Linux"
  | "External Linux";

interface ServiceVM {
  productId: string;
  productName?: string;
  Os: string;
  serviceType: ServiceType;
  cpu: number;
  ram: number;
  storage: number;
  ipSet: string;
  price: number;
  Stock?: boolean;
  createdAt?: Date;
}

type ServiceStatus = 'unsold' | 'pending' | 'active' | 'expired' | 'terminated';
type TerminationReason = 'expired' | 'unpaid' | 'banned' | null;

interface IService {
  _id?: string;
  relatedUser: string;
  relatedProduct: ServiceVM;

  // Service details
  serviceId: string;
  serviceNickname?: string;

  // Service type
  vmID?: number;
  purchaseDate?: Date;
  purchedFrom?: string;
  EXTRLhash?: string;

  // Credentials
  username?: string;
  password?: string;
  ipAddress?: string;

  // Status
  status: ServiceStatus;
  terminationDate: Date | null;
  terminationReason: TerminationReason;
  vmStatus: string;

  createdAt: Date;
  expiryDate?: Date;
}



interface ServiceStatusCardProps {
  status: string;
  service: IService;
}


export const ServiceStatusCard = ({ status, service }: ServiceStatusCardProps) => {
  const isRunning = () => {
    if (service?.relatedProduct?.serviceType?.includes("Internal")) {
      if (service?.vmStatus === 'rebooting') setTimeout(() => {
        window.location.reload()
      }, 25000);
      return service?.vmStatus === 'running' && status === 'active'
    }
    if (status === "rebooting") {
      setTimeout(() => {
        window.location.reload()
      }, 25000);
    }
    return status === 'active'
  }
  const isInternal = service?.relatedProduct?.serviceType?.includes("Internal")


  return (
    <Card className="relative h-[120px] w-full overflow-hidden bg-card border shadow-sm">
      <CardHeader className="relative p-3 pb-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className={cn(
            "h-4 w-4",
            isRunning() ? "text-emerald-500" : "text-red-500"
          )} />
          <span className="text-foreground/80">Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className={cn(
          "flex items-center gap-2.5 p-3 rounded-lg",
          isRunning()
            ? "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
            : "bg-red-500/5 text-red-600 dark:text-red-400"
        )}>
          {isRunning() ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-medium">
            {isInternal ? `${service?.vmStatus?.charAt(0).toUpperCase() + service?.vmStatus?.slice(1)}` : isRunning() ? "Running" : `${status.charAt(0).toUpperCase() + status.slice(1)}`}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
