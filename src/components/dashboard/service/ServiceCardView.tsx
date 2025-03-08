
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Server, Calendar, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


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

 interface Service {
  _id?: string;
  relatedUser: string ;
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
  
  createdAt: Date;
  expiryDate?: Date;
}

interface ServiceCardViewProps {
  services: Service[];
}

export const ServiceCardView = ({ services }: ServiceCardViewProps) => {
  const getStatusIcon = (status: string) => {
    if (status === "active") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    services.length > 0 ? (<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Link key={service._id} to={`/dashboard/services/${service?.serviceId}`}>
          <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <Server className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {service?.serviceNickname}
                    </CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {service.relatedProduct.Os}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Resources
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                         {service.relatedProduct.cpu} CPU
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {service.relatedProduct.ram} GB RAM
                      </p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {service.relatedProduct.storage} GB Storage
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Network
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-mono">
                      {service.ipAddress}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Expires</span>
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {getDate(service.expiryDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>): (
      <div className="flex items-center justify-center h-96">
        <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">
          No services found
        </p>
      </div>
    )
  );
};
