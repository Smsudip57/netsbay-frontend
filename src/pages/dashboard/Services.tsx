import { useEffect, useState } from "react";
import { ServiceListView } from "@/components/dashboard/service/ServiceListView";
import { ServiceCardView } from "@/components/dashboard/service/ServiceCardView";
import { ServiceFilters } from "@/components/dashboard/service/ServiceFilters";
import { ViewToggle } from "@/components/dashboard/service/ViewToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  const [viewType, setViewType] = useState<"list" | "cards">("cards");
  const [ipSetList, setIpSetList] = useState<string[]>([]);
  const [typeList, setTypeList] = useState<string[]>([]);
  const { services } = useAppContext();
  const [searchQuery, setSearchQuery] = useState<string>("");


  const filterServices = (services: IService[]) => {
    return services.filter((service) => {
      const isTypeMatch = typeFilter === "all" || service?.relatedProduct?.Os === typeFilter;
      const isIpSetMatch = ipSetFilter === "all" || service?.relatedProduct?.ipSet === ipSetFilter;
      const searchMatch = searchQuery === "" ||
        service?.serviceNickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.relatedProduct?.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.relatedProduct?.Os?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service?.relatedProduct?.serviceType?.toLowerCase().includes(searchQuery.toLowerCase());

      return isTypeMatch && isIpSetMatch && searchMatch;
    });
  };

  const filteredActiveServices = filterServices(
    mockServices.filter((service) =>
      service?.status === "active" && service?.ipAddress
    )
  );

  const filteredPendingServices = filterServices(
    mockServices.filter((service) =>
      !service?.ipAddress
    )
  );

  const filteredExpiredServices = filterServices(
    mockServices.filter((service) =>
      service?.status === "expired"
    )
  );

  // const filteredActiveServices = filterServices.filter((service) => {
  //   const isActive = (service?.status === "active" || service?.status === "pending") ;
  //   const matchesType =
  //     typeFilter === "all" || service?.relatedProduct?.Os === typeFilter;
  //   const matchesIpSet =
  //     ipSetFilter === "all" || service?.relatedProduct?.ipSet === ipSetFilter;
  //   return isActive && matchesType && matchesIpSet;
  // });

  // const filteredExpiredServices = filterServices.filter((service) => {
  //   const isExpired = service?.status === "expired";
  //   const matchesType =
  //     typeFilter === "all" || service?.relatedProduct?.Os === typeFilter;
  //   const matchesIpSet =
  //     ipSetFilter === "all" || service?.relatedProduct?.ipSet === ipSetFilter;
  //   return isExpired && matchesType && matchesIpSet;
  // });

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
            <div className="w-64">
              <Input
                type="text"
                placeholder="Search Ip/Os/Nickname"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
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
          <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Active Services
            </TabsTrigger>

            <TabsTrigger value="pending" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Pending Services
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
          <TabsContent value="pending" className="space-y-4">
            {viewType === "list" ? (
              <ServiceListView services={filteredPendingServices} />
            ) : (
              <ServiceCardView services={filteredPendingServices} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Services;
