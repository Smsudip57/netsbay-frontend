
import { useParams, useNavigate } from "react-router-dom";
import { ServiceActionsCard } from "@/components/dashboard/service/ServiceActionsCard";
import { ServiceHeader } from "@/components/dashboard/service/ServiceHeader";
import { SystemDetailsGrid } from "@/components/dashboard/service/SystemDetailsGrid";
import { ResourceUtilization } from "@/components/dashboard/service/ResourceUtilization";
import { ServiceCredentials } from "@/components/dashboard/service/ServiceCredentials";
import { ServiceStatusCard } from "@/components/dashboard/service/ServiceStatusCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useEffect } from "react";

// Mock data for resource utilization
const mockUtilization = {
  cpu: 45,
  ram: 60,
  disk: 30,
  network: 25,
};

// Find service by ID from mock data
const findServiceById = (id: string) => {
  const mockServices = [
    {
      id: "vm-001",
      nickname: "Ubuntu Basic Server",
      name: "Ubuntu Basic Server",
      type: "Linux-Ubuntu",
      status: "expired",
      ip: "103.211.12.101",
      expiryDate: "2024-03-31",
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
      ipSet: "103.211.12.101/24",
    },
    {
      id: "vm-002",
      nickname: "Ubuntu Pro Server",
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
      nickname: "CentOS Basic Server",
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
      nickname: "CentOS Pro Server",
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
      nickname: "Windows Basic Server",
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
      nickname: "Windows Pro Server",
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

  return mockServices.find(service => service.id === id);
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const serviceDetails = id ? findServiceById(id) : null;

  useEffect(() => {
    if (!serviceDetails) {
      navigate("/dashboard/services");
    }
  }, [serviceDetails, navigate]);

  if (!serviceDetails) {
    return null;
  }

  const isExpired = serviceDetails.status === 'expired';

  return (
    <main className="p-8 flex-1 bg-background/50 min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/dashboard/services")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        <div className="space-y-8">
          <ServiceHeader 
            nickname={serviceDetails.nickname}
            id={serviceDetails.id}
            type={serviceDetails.type}
            status={serviceDetails.status}
          />

          <SystemDetailsGrid details={{
            type: serviceDetails.type,
            ipSet: serviceDetails.ipSet || '',
            cpu: serviceDetails.specs.cpu,
            ram: serviceDetails.specs.ram,
            storage: serviceDetails.specs.storage,
          }} />

          {isExpired && (
            <div className="flex items-center justify-between p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">This service has expired. Please renew to continue using the service.</p>
              </div>
              <Button 
                variant="outline"
                className="bg-amber-500 text-white hover:bg-amber-600 border-amber-500 hover:border-amber-600 transition-colors shadow-sm"
                onClick={() => navigate("/dashboard/services/renew/" + id)}
              >
                Renew Service
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ServiceStatusCard status={serviceDetails.status} />
            <div className="md:col-span-3">
              {serviceDetails.serviceType !== 'type2' && (
                <ServiceActionsCard 
                  serviceType={serviceDetails.serviceType}
                  vmId={serviceDetails.vmId}
                  status={serviceDetails.status}
                />
              )}
            </div>
          </div>

          <div className="space-y-8">
            <ResourceUtilization utilization={mockUtilization} />

            <ServiceCredentials 
              credentials={{
                ipAddress: serviceDetails.ip,
                username: serviceDetails.username,
                password: serviceDetails.password,
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetails;
