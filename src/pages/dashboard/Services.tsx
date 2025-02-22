
import { useState } from "react";
import { ServiceListView } from "@/components/dashboard/service/ServiceListView";
import { ServiceCardView } from "@/components/dashboard/service/ServiceCardView";
import { ServiceFilters } from "@/components/dashboard/service/ServiceFilters";
import { ViewToggle } from "@/components/dashboard/service/ViewToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";

// Mock data for demonstration
const mockServices = [
  {
    id: "vm-001",
    name: "Ubuntu Basic Server",
    type: "Linux-Ubuntu",
    status: "online",
    ip: "103.211.12.101",
    expiryDate: "2024-12-31",
    specs: {
      cpu: "2 vCPU",
      ram: "2 GB",
      storage: "10 GB",
    },
    productName: "Ubuntu Basic",
    username: "admin",
    password: "********",
    vmId: "VM001",
    serviceType: "type1",
  },
  {
    id: "vm-002",
    name: "Ubuntu Pro Server",
    type: "Linux-Ubuntu",
    status: "online",
    ip: "103.211.12.102",
    expiryDate: "2024-12-31",
    specs: {
      cpu: "4 vCPU",
      ram: "8 GB",
      storage: "20 GB",
    },
    productName: "Ubuntu Pro",
    username: "admin",
    password: "********",
    vmId: "VM002",
    serviceType: "type1",
  },
  {
    id: "vm-003",
    name: "CentOS Basic Server",
    type: "Linux-CentOS",
    status: "stopped",
    ip: "103.157.13.101",
    expiryDate: "2024-12-31",
    specs: {
      cpu: "2 vCPU",
      ram: "4 GB",
      storage: "10 GB",
    },
    productName: "CentOS Basic",
    username: "admin",
    password: "********",
    vmId: "VM003",
    serviceType: "type1",
  },
  {
    id: "vm-004",
    name: "CentOS Pro Server",
    type: "Linux-CentOS",
    status: "online",
    ip: "103.157.13.102",
    expiryDate: "2024-12-31",
    specs: {
      cpu: "6 vCPU",
      ram: "16 GB",
      storage: "20 GB",
    },
    productName: "CentOS Pro",
    username: "admin",
    password: "********",
    vmId: "VM004",
    serviceType: "type1",
  },
  {
    id: "vm-005",
    name: "Windows Basic Server",
    type: "Windows",
    status: "expired",
    ip: "157.15.14.101",
    expiryDate: "2024-06-30",
    specs: {
      cpu: "4 vCPU",
      ram: "8 GB",
      storage: "30 GB",
    },
    productName: "Windows Server Basic",
    username: "administrator",
    password: "********",
    vmId: "VM005",
    serviceType: "type2",
  },
  {
    id: "vm-006",
    name: "Windows Pro Server",
    type: "Windows",
    status: "online",
    ip: "157.15.14.102",
    expiryDate: "2024-12-31",
    specs: {
      cpu: "8 vCPU",
      ram: "32 GB",
      storage: "45 GB",
    },
    productName: "Windows Server Pro",
    username: "administrator",
    password: "********",
    vmId: "VM006",
    serviceType: "type1",
  },
];

const Services = () => {
  const [ipSetFilter, setIpSetFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewType, setViewType] = useState<"list" | "cards">("list");

  const filteredActiveServices = mockServices.filter((service) => {
    const isActive = ["online", "stopped"].includes(service.status);
    const matchesType = typeFilter === "all" || service.type === typeFilter;
    const matchesIpSet = ipSetFilter === "all" || service.ip.split('.').slice(0, 2).join('.') === ipSetFilter;
    return isActive && matchesType && matchesIpSet;
  });

  const filteredExpiredServices = mockServices.filter((service) => {
    const isExpired = service.status === "expired";
    const matchesType = typeFilter === "all" || service.type === typeFilter;
    const matchesIpSet = ipSetFilter === "all" || service.ip.split('.').slice(0, 2).join('.') === ipSetFilter;
    return isExpired && matchesType && matchesIpSet;
  });

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Your Services</h2>
          <div className="flex items-center gap-4">
            <ViewToggle viewType={viewType} onViewChange={setViewType} />
            <ServiceFilters
              ipSetFilter={ipSetFilter}
              typeFilter={typeFilter}
              onIpSetFilterChange={setIpSetFilter}
              onTypeFilterChange={setTypeFilter}
            />
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Active Services
            </TabsTrigger>
            <TabsTrigger value="expired" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Expired Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {viewType === "list" 
              ? <ServiceListView services={filteredActiveServices} />
              : <ServiceCardView services={filteredActiveServices} />
            }
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            {viewType === "list"
              ? <ServiceListView services={filteredExpiredServices} />
              : <ServiceCardView services={filteredExpiredServices} />
            }
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Services;

