
import { Link } from "react-router-dom";
import { Globe, Server, Calendar, Database, Monitor } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ServiceStatusIcon } from "./ServiceStatusIcon";
import { useNavigate } from "react-router-dom";


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

interface ServiceListViewProps {
  services: Service[];
}

export const ServiceListView = ({ services }: ServiceListViewProps) => {
  const router = useNavigate();

  const getDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP Address</TableHead>
          <TableHead>OS Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Resources</TableHead>
          <TableHead>Expiry Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length > 0 ? (services.map((service) => (
          <TableRow key={service._id} onClick={()=> router(`/dashboard/services/${service?.serviceId}`)} className="cursor-pointer">
            <TableCell className="font-mono">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                {service?.ipAddress}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-slate-500" />
                {service.relatedProduct.Os}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ServiceStatusIcon status={service.status} />
                <span className="capitalize">{service.status}</span>
              </div>
            </TableCell>
            <TableCell>
              <div
                className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              >
                <Server className="h-4 w-4 text-slate-500" />
                {service?.serviceNickname}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Database className="h-3.5 w-3.5" />
                  {service?.relatedProduct?.cpu} vCPU / {service?.relatedProduct?.ram} GB / {service?.relatedProduct?.storage} GB
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                {getDate(service.expiryDate)}
              </div>
            </TableCell>
          </TableRow>
        )))
        : ( <TableRow>
            <TableCell colSpan={6} className="text-center">
              No services found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

