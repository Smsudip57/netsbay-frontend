import { Package, Shield, Cpu, CircuitBoard, HardDrive, Network, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const BuyService = () => {
  const navigate = useNavigate();
  const ipSets = ["103.211", "103.157", "157.15", "38.3", "161.248"];
  const [services, setServices] = useState<ServiceVM[]>([]);
  
  // const generateServicesForIpSets = () => {
  //   return baseServices.flatMap(service => 
  //     ipSets.map(ipSet => ({
  //       id: `${service.baseId}-${ipSet}`,
  //       name: service.name,
  //       type: service.type,
  //       cpu: service.cpu,
  //       ram: service.ram,
  //       storage: service.storage,
  //       ipSet: ipSet,
  //       price: service.basePrice,
  //     }))
  //   );
  // };

  // const services: ServiceVM[] = generateServicesForIpSets();

  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCPU, setSelectedCPU] = useState<string>("all");
  const [selectedRAM, setSelectedRAM] = useState<string>("all");
  const [selectedStorage, setSelectedStorage] = useState<string>("all");
  const [selectedIPSet, setSelectedIPSet] = useState<string>("all");

  const filteredServices = services.filter((service) => {
    return (
      (selectedType === "all" || service.serviceType === selectedType) &&
      (selectedCPU === "all" || service.cpu === parseInt(selectedCPU)) &&
      (selectedRAM === "all" || service.ram === parseInt(selectedRAM)) &&
      (selectedStorage === "all" || service.storage === parseInt(selectedStorage)) &&
      (selectedIPSet === "all" || service.ipSet === selectedIPSet)
    );
  });

  useEffect(() => {
    const fetchBaseServices = async () => {
      try {
        const res = await axios.get('/api/user/all_plans', {withCredentials: true});
        if(res?.data){
          setServices(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchBaseServices();
  }, []);





  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h2 className="text-3xl font-bold mb-6">Available Virtual Machines</h2>
        
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
            <Card key={service.productId}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  {service.serviceType.includes("RDP") ? (
                    <Monitor className="h-5 w-5" />
                  ) : (
                    <Package className="h-5 w-5" />
                  )}
                  <CardTitle>{service?.productName}</CardTitle>
                </div>
                <CardDescription>{service?.Os}</CardDescription>
                <div className="mt-2 inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md">
                  <Network className="h-4 w-4" />
                  <span className="font-medium">IP Set: {service.ipSet}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span>{service.cpu} CPU Cores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CircuitBoard className="h-4 w-4" />
                    <span>{service.ram} GB RAM</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    <span>{service.storage} GB Storage</span>
                  </li>
                  <li className="mt-4 pt-4 border-t">
                    <span className="text-lg font-semibold">{service.price} NC</span>
                  </li>
                </ul>
                <Button 
                  className="w-full"
                  onClick={() => navigate('purchase', { state: { service } })}
                >
                  Purchase Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BuyService;
