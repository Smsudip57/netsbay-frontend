import {
  Package,
  Shield,
  Cpu,
  CircuitBoard,
  HardDrive,
  Network,
  Monitor,
  Hash,
  FolderCode,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { set } from "date-fns";
import { toast } from "sonner";

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

const AdminProducts = () => {
  const navigate = useNavigate();
  const ipSets = ["103.211", "103.157", "157.15", "38.3", "161.248"];
  const [services, setService] = useState<ServiceVM[]>([]);

  const generateServicesForIpSets = () => {
    const baseServices = [
      {
        baseId: "ubuntu-basic",
        name: "Ubuntu Basic",
        type: "Linux-Ubuntu",
        cpu: 2,
        ram: 2,
        storage: 10,
        basePrice: 100,
        enabled: true,
      },
      {
        baseId: "ubuntu-pro",
        name: "Ubuntu Pro",
        type: "Linux-Ubuntu",
        cpu: 4,
        ram: 8,
        storage: 20,
        basePrice: 200,
      },
      {
        baseId: "centos-basic",
        name: "CentOS Basic",
        type: "Linux-CentOS",
        cpu: 2,
        ram: 4,
        storage: 10,
        basePrice: 120,
      },
      {
        baseId: "centos-pro",
        name: "CentOS Pro",
        type: "Linux-CentOS",
        cpu: 6,
        ram: 16,
        storage: 20,
        basePrice: 240,
      },
      {
        baseId: "windows-basic",
        name: "Windows Server Basic",
        type: "Windows",
        cpu: 4,
        ram: 8,
        storage: 30,
        basePrice: 300,
      },
      {
        baseId: "windows-pro",
        name: "Windows Server Pro",
        type: "Windows",
        cpu: 8,
        ram: 32,
        storage: 45,
        basePrice: 500,
      },
    ];

    return baseServices.flatMap((service) =>
      ipSets.map((ipSet) => ({
        id: `${service.baseId}-${ipSet}`,
        name: service.name,
        type: service.type,
        cpu: service.cpu,
        ram: service.ram,
        storage: service.storage,
        ipSet: ipSet,
        price: service.basePrice,
        enabled: service.enabled,
      }))
    );
  };

  const [serviceStates, setServiceStates] = useState<{
    [key: string]: boolean;
  }>(() => {
    const initialStates: { [key: string]: boolean } = {};
    services.forEach((service) => {
      initialStates[service?.productId] = service.Stock || false;
    });
    return initialStates;
  });

  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCPU, setSelectedCPU] = useState<string>("all");
  const [selectedRAM, setSelectedRAM] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");
  const [selectedIPSet, setSelectedIPSet] = useState<string>("all");

  const filteredServices = services.filter((service) => {
    return (
      (selectedType === "all" || service?.serviceType.includes(selectedType)) &&
      (selectedCPU === "all" || service.cpu === parseInt(selectedCPU)) &&
      (selectedRAM === "all" || service.ram === parseInt(selectedRAM)) &&
      (selectedStorage === "all" ||
        service.storage === parseInt(selectedStorage)) &&
      (selectedIPSet === "all" || service.ipSet === selectedIPSet)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/user/all_plans", {
          withCredentials: true,
        });
        if (response?.data) {
          setService(response?.data);
          
          setServiceStates((prev) => {
            const initialStates: { [key: string]: boolean } = {};
            response?.data.forEach((service) => {
              initialStates[service?.productId] = service.Stock || false;
            });
            return initialStates;
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
      }
    };
    fetchData();
  }, []);

  const handleEdit = (serviceId: string) => {
    navigate(`/admin/products/edit/${serviceId}`);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const res = await axios.post(`/api/admin/delete_product`, { productId: serviceId }, {withCredentials: true});
      if(res?.data){
        toast.success(res?.data?.message);
        setService((prev) => prev.filter((service) => service.productId !== serviceId));
      }
    } catch (error) {
      toast.error("Failed to delete service.");
    }
  };

  const handleToggleService = async (serviceId: string) => {
    try {
      const response:any =  await axios.post(
        `/api/admin/stock_product`,
        {
          productId: serviceId,
          value: !serviceStates[serviceId],
        },
        {
          withCredentials: true,
        }
      )
      if(response) {
        setServiceStates((prev) => ({
          ...prev,
          [serviceId]: !prev[serviceId],
        }));
      }
      toast.success(response?.data?.message);
    } catch (error) {
      toast.error("Failed to update service state.");
    }
 
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-6 border border-border">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <Button onClick={() => navigate("/admin/products/add")}>
            Add New Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Select onValueChange={setSelectedType} value={selectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {[
                "Internal RDP",
                "External RDP",
                "Internal Linux",
                "External Linux",
              ].map((type, index) => (
                <SelectItem key={index} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedCPU} value={selectedCPU}>
            <SelectTrigger>
              <SelectValue placeholder="Select CPU" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All CPUs</SelectItem>
              <SelectItem value="2">2 Cores</SelectItem>
              <SelectItem value="4">4 Cores</SelectItem>
              <SelectItem value="6">6 Cores</SelectItem>
              <SelectItem value="8">8 Cores</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedRAM} value={selectedRAM}>
            <SelectTrigger>
              <SelectValue placeholder="Select RAM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All RAM</SelectItem>
              <SelectItem value="2">2 GB</SelectItem>
              <SelectItem value="4">4 GB</SelectItem>
              <SelectItem value="8">8 GB</SelectItem>
              <SelectItem value="16">16 GB</SelectItem>
              <SelectItem value="32">32 GB</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedStorage} value={selectedStorage}>
            <SelectTrigger>
              <SelectValue placeholder="Select Storage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Storage</SelectItem>
              <SelectItem value="10">10 GB</SelectItem>
              <SelectItem value="20">20 GB</SelectItem>
              <SelectItem value="30">30 GB</SelectItem>
              <SelectItem value="45">45 GB</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedIPSet} value={selectedIPSet}>
            <SelectTrigger>
              <SelectValue placeholder="Select IP Set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All IP Sets</SelectItem>
              {ipSets.map((ip) => (
                <SelectItem key={ip} value={ip}>
                  {ip}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card key={service?.productId} className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {service?.serviceType.includes("RDP") ? (
                      <Monitor className="h-5 w-5 text-primary" />
                    ) : (
                      <Package className="h-5 w-5 text-primary" />
                    )}
                    <CardTitle className="text-lg">{service.Os}</CardTitle>
                  </div>
                  <Switch
                    checked={serviceStates[service?.productId]}
                    onCheckedChange={() =>
                      handleToggleService(service?.productId)
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <CardDescription className="font-mono">
                    {service?.productId}
                  </CardDescription>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Network className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    IP Set: {service.ipSet}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <Cpu className="h-4 w-4 text-primary" />
                      <span className="text-sm">{service.cpu} Cores</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <CircuitBoard className="h-4 w-4 text-primary" />
                      <span className="text-sm">{service.ram} GB RAM</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <HardDrive className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {service.storage} GB Storage
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                      <FolderCode className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        {service?.serviceType.includes("RDP")
                          ? "Windows"
                          : "Linux"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-lg font-semibold">
                      {service.price} NC
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(service?.productId)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(service?.productId)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminProducts;
