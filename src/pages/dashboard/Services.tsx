import { useEffect, useState } from "react";
import { ServiceListView } from "@/components/dashboard/service/ServiceListView";
import { ServiceCardView } from "@/components/dashboard/service/ServiceCardView";
import { ServiceFilters } from "@/components/dashboard/service/ServiceFilters";
import { ViewToggle } from "@/components/dashboard/service/ViewToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useAppContext } from "@/context/context";

// Mock data for demonstration

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

type ServiceStatus = "unsold" | "pending" | "active" | "expired" | "terminated";
type TerminationReason = "expired" | "unpaid" | "banned" | null;

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

  createdAt: Date;
  expiryDate?: Date;
}

const Services = () => {
  const [mockServices, setMockServices] = useState<IService[]>([]);
  const [ipSetFilter, setIpSetFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewType, setViewType] = useState<"list" | "cards">("list");
  const [ipSetList, setIpSetList] = useState<string[]>([]);
  const [typeList, setTypeList] = useState<string[]>([]);
  const { services } = useAppContext();

  const filteredActiveServices = mockServices.filter((service) => {
    const isActive = (service?.status === "active" || service?.status === "pending") ;
    const matchesType =
      typeFilter === "all" || service?.relatedProduct?.Os === typeFilter;
    const matchesIpSet =
      ipSetFilter === "all" || service?.relatedProduct?.ipSet === ipSetFilter;
    return isActive && matchesType && matchesIpSet;
  });

  const filteredExpiredServices = mockServices.filter((service) => {
    const isExpired = service?.status === "expired";
    const matchesType =
      typeFilter === "all" || service?.relatedProduct?.Os === typeFilter;
    const matchesIpSet =
      ipSetFilter === "all" || service?.relatedProduct?.ipSet === ipSetFilter;
    return isExpired && matchesType && matchesIpSet;
  });

  useEffect(() => {
    if (services?.length > 0) {
      setMockServices(services);
      const ipSetList = services.map(
        (service: IService) => service.relatedProduct.ipSet
      );
      const typeList = services.map(
        (service: IService) => service.relatedProduct.Os
      );
      setIpSetList([...new Set(ipSetList as string[])]);
      setTypeList([...new Set(typeList as string[])]);
    }
  }, [services]);

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
              ipSetList={ipSetList}
              typeList={typeList}
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
            {viewType === "list" ? (
              <ServiceListView services={filteredActiveServices} />
            ) : (
              <ServiceCardView services={filteredActiveServices} />
            )}
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            {viewType === "list" ? (
              <ServiceListView services={filteredExpiredServices} />
            ) : (
              <ServiceCardView services={filteredExpiredServices} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Services;
