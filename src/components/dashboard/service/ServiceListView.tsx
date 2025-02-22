
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

interface Service {
  id: string;
  name: string;
  type: string;
  status: string;
  ip: string;
  expiryDate: string;
  specs: {
    cpu: string;
    ram: string;
    storage: string;
  };
}

interface ServiceListViewProps {
  services: Service[];
}

export const ServiceListView = ({ services }: ServiceListViewProps) => {
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
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-mono">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                {service.ip}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-slate-500" />
                {service.type}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ServiceStatusIcon status={service.status} />
                <span className="capitalize">{service.status}</span>
              </div>
            </TableCell>
            <TableCell>
              <Link 
                to={`/dashboard/services/${service.id}`} 
                className="flex items-center gap-2 hover:text-blue-500 transition-colors"
              >
                <Server className="h-4 w-4 text-slate-500" />
                {service.name}
              </Link>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Database className="h-3.5 w-3.5" />
                  {service.specs.cpu} / {service.specs.ram} / {service.specs.storage}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                {service.expiryDate}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

