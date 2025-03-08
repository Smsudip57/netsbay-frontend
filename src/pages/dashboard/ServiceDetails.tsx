
import { useParams, useNavigate } from "react-router-dom";
import { ServiceActionsCard } from "@/components/dashboard/service/ServiceActionsCard";
import { ServiceHeader } from "@/components/dashboard/service/ServiceHeader";
import { SystemDetailsGrid } from "@/components/dashboard/service/SystemDetailsGrid";
import { ResourceUtilization } from "@/components/dashboard/service/ResourceUtilization";
import { ServiceCredentials } from "@/components/dashboard/service/ServiceCredentials";
import { ServiceStatusCard } from "@/components/dashboard/service/ServiceStatusCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { date } from "zod";

// Mock data for resource utilization

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

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceDetails, setServiceDetails] = useState<IService>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/user/service`,{
          params: { serviceId: id },
          withCredentials: true,
        });
        if(res?.data){
          setServiceDetails(res?.data);
        }
      } catch (error) {
        navigate("/dashboard/services");
      }
    }
    fetchData();
    if (!serviceDetails) {
    }
  }, []);



  if (!serviceDetails) {
    return null;
  }

  const isExpired = (date: Date) => {
    return new Date(date) < new Date();
  };

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
            nickname={serviceDetails?.serviceNickname}
            id={serviceDetails?.serviceId}
            type={serviceDetails?.relatedProduct?.Os}
            status={serviceDetails.status}
            date={serviceDetails.expiryDate}
          />

          <SystemDetailsGrid details={{
            type: serviceDetails?.relatedProduct?.Os,
            ipSet: serviceDetails?.relatedProduct?.ipSet || '',
            cpu: serviceDetails?.relatedProduct?.cpu,
            ram: serviceDetails?.relatedProduct?.ram,
            storage: serviceDetails?.relatedProduct?.storage,
          }} />

          {isExpired(serviceDetails?.expiryDate) && (
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
            <ServiceStatusCard status={serviceDetails?.status} />
            <div className="md:col-span-3">
            <ServiceActionsCard 
                  serviceType={serviceDetails?.relatedProduct?.serviceType}
                  vmId={serviceDetails?.serviceId}
                  status={serviceDetails.status}
                />
            </div>
          </div>

          <div className="space-y-8">
            {/* <ResourceUtilization utilization={mockUtilization} /> */}

            <ServiceCredentials 
              credentials={{
                ipAddress: serviceDetails.ipAddress,
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
