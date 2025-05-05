import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ServiceActionsCard } from "@/components/dashboard/service/ServiceActionsCard";
import { ServiceHeader } from "@/components/dashboard/service/ServiceHeader";
import { SystemDetailsGrid } from "@/components/dashboard/service/SystemDetailsGrid";
import { ResourceUtilization } from "@/components/dashboard/service/ResourceUtilization";
import { ServiceCredentials } from "@/components/dashboard/service/ServiceCredentials";
import { ServiceStatusCard } from "@/components/dashboard/service/ServiceStatusCard";
import DataCenterStatus from "@/components/dashboard/service/ServiceDataCenterCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, ArrowRight, Save } from "lucide-react";
import { useAppContext } from "@/context/context";
import { toast } from "sonner";
import ServiceAddCredentials from "@/components/admin/ServiceAddCredentials";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useRef } from "react";
import { Check, ChevronsUpDown, Hash, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios"


interface DatacenterValue {
  location: string;
  datastore: string;
  status: boolean;
}

interface DatacenterSystem {
  _id: string;
  name: 'datacenter';
  value: DatacenterValue;
  createdAt: Date;
  updatedAt: Date;
}

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
  dataCenterLocation?:DatacenterSystem;
}

type ServiceStatus = "unsold" | "pending" | "active" | "expired" | "terminated";
type TerminationReason = "expired" | "unpaid" | "banned" | null;

export interface IService {
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
  vmStatus: string;
  rebuildRequestExists?: boolean;

  createdAt: Date;
  expiryDate?: Date;
}

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [serviceDetails, setServiceDetails] = useState<IService>();
  const [renewLoading, setRenewLoading] = useState(false);
  const adminPath = location.pathname.startsWith("/admin");
  const { user, setUser } = useAppContext();
  const isAdmin = user?.role === "admin";
  const [request, setRequest] = useState();
  const [Change, setChange] = useState<{
    vmID: string;
    EXTRLhash: string;
    expiryDate: string;
    vmtype: any;
    purchedFrom?: string;
    relatedUser?: any;
  }>({
    vmID: "",
    EXTRLhash: "",
    expiryDate: "",
    vmtype: "",
    purchedFrom: "",
    relatedUser: ""
  });
  const [allPlans, setAllPlans] = useState([]);
  const [providers, setProviders] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          isAdmin && location.pathname.includes("/request")
            ? `/api/admin/request`
            : `/api/user/service`,
          {
            params:
              isAdmin && location.pathname.includes("/request")
                ? { requestId: id }
                : { serviceId: id },
            withCredentials: true,
          }
        );
        if (res?.data) {
          if (isAdmin && location.pathname.includes("/request")) {
            try {
              const anotherfetch = await axios.get(
                `/api/user/service`,
                {
                  params: { serviceId: res?.data?.serviceMongoID?.serviceId },
                  withCredentials: true,
                })
              if (anotherfetch?.data) {
                setServiceDetails(anotherfetch?.data);
              }
            } catch (error) {
              setServiceDetails(res?.data?.serviceMongoID);
              console.log("e")
            }
            const service = res?.data?.serviceMongoID;
            service.relatedProduct = res?.data?.productMongoID;
            service.relatedUser = res?.data?.relatedUser;
            setRequest(res?.data);
          } else {
            setServiceDetails(res?.data);
          }
          if (isAdmin) {
            try {
              const plans: any = await axios.get("/api/user/all_plans", {
                withCredentials: true,
              });
              setAllPlans(plans?.data);
              console.log(
                plans?.data?.find(
                  (plan: any) =>
                    plan?.productId === res?.data?.relatedProduct?.productId
                )
              );
              setChange({
                vmID: res?.data?.vmID,
                EXTRLhash: res?.data?.EXTRLhash,
                expiryDate: res?.data?.expiryDate,
                vmtype: location.pathname.includes("/request") ? res?.data?.productMongoID : plans?.data?.find(
                  (plan: any) =>
                    plan?.productId === res?.data?.relatedProduct?.productId
                ),
                purchedFrom: res?.data?.purchedFrom,
              });
            } catch (error) {
              console.log(error);
            }
            try {
              const Provider: any = await axios.get("/api/admin/system", {
                params: { name: "providers" },
                withCredentials: true,
              });
              if (Provider?.data) setProviders(Provider?.data);
            } catch (error) {
              console.log(error);
            }
          }
        }
      } catch (error) {
        console.log(error);
        if (user) {
          navigate(-1);
        }
      }
    };
    if (!serviceDetails && !request) {
      fetchData();
    }
  }, [user]);

  if (!serviceDetails) {
    return null;
  }

  const isExpired = (date: Date) => {
    return new Date(date) < new Date();
  };

  const actions = () => {
    let actions = [];
    if (!serviceDetails.ipAddress) {
      return actions;
    }
    if (serviceDetails?.relatedProduct?.serviceType?.includes("Internal")) {
      if (serviceDetails?.vmStatus === "running") {
        actions = ["stop", "reboot", "changepass"];
      } else {
        actions.push("start");
      }
      if (isExpired(serviceDetails?.expiryDate)) {
        actions = [];
      }
    } else {
      if (serviceDetails?.relatedProduct?.serviceType?.includes("Linux")) {
        actions = ["reboot", "changepass"];
      } else {
        // actions = ["reboot"];
      }
      if (isExpired(serviceDetails?.expiryDate)) {
        actions = [];
      }
    }
    actions.push("rebuild");
    if (isAdmin && adminPath) {
      if (actions.includes("changepass"))
        actions = actions.filter((action) => action !== "changepass");
      if (location.pathname.includes("/request"))
        actions.push("approveed", "reject");
      if (!location.pathname.includes("/requests")) actions.push("terminate");
    } else {
      if (
        serviceDetails?.status === "terminated" ||
        serviceDetails?.status === "expired"
      ) {
        actions = [];
      }
    }
    return actions;
  };

  const handleRenewService = async () => {
    setRenewLoading(true);
    try {
      const response = await axios.post(
        "/api/user/renew_service",
        {
          serviceId: serviceDetails?.serviceId,
        },
        { withCredentials: true }
      );
      if (response?.data) {
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          setServiceDetails(response?.data?.service);
          setUser(response?.data?.user)
        }
      }
    } catch (error) {
      console.error(error?.response?.data || "Something went wrong");
      toast.error("Failed to renew service");
    } finally {
      setRenewLoading(false);
    }
  };

  // console.log(serviceDetails)
  const changeChecker = () => {
    const originalDate = serviceDetails?.expiryDate
      ? new Date(serviceDetails.expiryDate).getTime()
      : null;
    const newDate = Change?.expiryDate
      ? new Date(Change.expiryDate).getTime()
      : null;
    const dateChanged = originalDate !== newDate;
    if (
      Number(Change?.vmID) !== serviceDetails?.vmID ||
      Change?.EXTRLhash !== serviceDetails?.EXTRLhash ||
      dateChanged ||
      Change?.vmtype?.productId !== serviceDetails?.relatedProduct?.productId ||
      Change?.purchedFrom !== serviceDetails?.purchedFrom ||
      serviceDetails?.relatedUser !== Change?.relatedUser
    ) {
      return true;
    }
  };

  const handleUpdateService = async () => {
    if (Change.vmID && Change.EXTRLhash) {
      toast.error("Either vm id or external hash is required");
      return;
    }
    setUpdateLoading(true);
    try {
      const response = await axios.post(
        "/api/admin/update_service",
        {
          serviceId: serviceDetails?.serviceId,
          vmID: Change?.vmID,
          EXTRLhash: Change?.EXTRLhash,
          expiryDate: Change?.expiryDate,
          productId: Change?.vmtype?.productId,
          purchedFrom: Change?.purchedFrom,
          relatedUser: Change?.relatedUser,
        },
        { withCredentials: true }
      );
      if (response?.data) {
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          setServiceDetails(response?.data?.service);
          setChange({
            vmID: response?.data?.service?.vmID,
            EXTRLhash: response?.data?.service?.EXTRLhash,
            expiryDate: response?.data?.service?.expiryDate,
            vmtype: Change.vmtype,
          });
        } else {
          toast.error(response?.data?.message);
        }
      }
    } catch (error) {
      console.error(error?.response?.data || "Something went wrong");
      toast.error("Failed to update service");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <main className="p-8 flex-1 bg-background/50 min-h-screen">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
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
            isAdmin={isAdmin}
            adminPath={adminPath}
            location={location.pathname}
            setExpiryDate={(date: any) => {
              setChange({ ...Change, expiryDate: date });
            }}
          />
          {isAdmin && adminPath && (
            <div className="flex items-end justify-between">
              <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
                {
                  Change?.vmtype?.serviceType?.includes("Internal") && (
                    <div className="p-3 rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer group">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="text-sm">Vm Id</span>
                        </div>
                      </div>
                      <Input
                        className="text-sm font-medium text-blue-500 truncate"
                        type="text"
                        placeholder={`Enter vm id`}
                        value={Change?.vmID}
                        onChange={(e) =>
                          setChange({ ...Change, vmID: e.target.value })
                        }
                      />
                    </div>
                  )
                }
                {
                  Change?.vmtype?.serviceType?.includes("External Linux") && (
                    <div className="p-3 rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer group">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="text-sm">External Hash</span>
                        </div>
                      </div>
                      <Input
                        className="text-sm font-medium text-blue-500 truncate"
                        type="text"
                        placeholder={`Enter external hash`}
                        value={Change?.EXTRLhash}
                        onChange={(e) =>
                          setChange({ ...Change, EXTRLhash: e.target.value })
                        }
                      />
                    </div>
                  )}

                <div className="p-3 rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer group">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Hash className="h-3.5 w-3.5" />
                      <span className="text-sm">Change Plan</span>
                    </div>
                  </div>
                  <Select
                    value={Change?.vmtype?.productId}
                    onValueChange={(productId) => {
                      const selectedPlan = allPlans.find(
                        (plan: any) => plan.productId === productId
                      );
                      setChange({ ...Change, vmtype: selectedPlan });
                      // setServiceDetails({
                      //   ...serviceDetails,
                      //   relatedProduct: selectedPlan,
                      // });
                    }}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Choose product">
                        {Change?.vmtype?.productName || "Select plan"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {allPlans?.map((plan: any) => (
                        <SelectItem
                          key={plan?.productId}
                          value={plan.productId}
                        >
                          {plan?.productName} • {plan?.cpu}C / {plan?.ram}GB / {plan?.storage}GB • {plan?.ipSet}  • {plan?.serviceType}  • {plan?.Os} • {plan?.price}NC/month 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {
                  Change?.vmtype?.serviceType?.includes("External") && (
                    <div className="p-3 rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer group">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Hash className="h-3.5 w-3.5" />
                          <span className="text-sm">Choose Provider</span>
                        </div>
                      </div>
                      <Select
                        value={Change?.purchedFrom}
                        onValueChange={(provider) => {
                          setChange({ ...Change, purchedFrom: provider });
                        }}
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Choose provider">
                            {Change?.purchedFrom || "Choose provider"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {providers?.map((item: any, index: number) => (
                            <SelectItem key={index} value={item?.value}>
                              {item?.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                }
                {
                  (!serviceDetails?.relatedUser || serviceDetails?.status === "unsold") && (
                    <UserEmailSearch
                      val={Change?.relatedUser}
                      onChange={(user) => {

                        setChange({ ...Change, relatedUser: user._id });
                      }}
                    />
                  )
                }

              </div>
              {changeChecker() && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleUpdateService}
                  className="mb-6"
                  disabled={updateLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update Service
                </Button>
              )}
            </div>
          )}

          <SystemDetailsGrid
            details={{
              type: serviceDetails?.relatedProduct?.Os,
              ipSet: serviceDetails?.relatedProduct?.ipSet || "",
              cpu: serviceDetails?.relatedProduct?.cpu,
              ram: serviceDetails?.relatedProduct?.ram,
              storage: serviceDetails?.relatedProduct?.storage,
            }}
          />

          {isExpired(serviceDetails?.expiryDate) && !adminPath && (
            <div className="flex items-center justify-between p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">
                  This service has expired. Please renew to continue using the
                  service.
                </p>
              </div>
              <Button
                variant="outline"
                className="bg-amber-500 text-white hover:bg-amber-600 border-amber-500 hover:border-amber-600 transition-colors shadow-sm"
                onClick={() => handleRenewService()}
                disabled={serviceDetails?.status === "pending" || renewLoading}
              >
                Renew Service
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <DataCenterStatus
              status={serviceDetails?.relatedProduct?.dataCenterLocation?.value.status}
              value={serviceDetails?.relatedProduct?.dataCenterLocation?.value}
            />
            <ServiceStatusCard
              status={serviceDetails?.status}
              service={serviceDetails}
            />
            <div className="md:col-span-2">
              <ServiceActionsCard
                serviceType={serviceDetails?.relatedProduct?.serviceType}
                vmId={serviceDetails?.serviceId}
                status={serviceDetails.status}
                service={serviceDetails}
                setService={(data: IService) => {
                  setServiceDetails(data);
                }}
                request={request}
                setRequest={setRequest}
                actions={actions}
              />
            </div>
          </div>

          {!serviceDetails?.relatedProduct?.dataCenterLocation?.value?.status&& (
            <div className="flex items-center justify-between p-6 bg-amber-500/10 border border-amber-500/20 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">
                We are currently experiencing some issues with our network or servers, which may temporarily affect this service. If everything is functioning normally on your end, please disregard this message.
                </p>
              </div>
              
            </div>
          )}

          <div className="space-y-8">
            {/* <ResourceUtilization utilization={mockUtilization} /> */}

            <ServiceCredentials
              credentials={{
                ipAddress: serviceDetails.ipAddress,
                username: serviceDetails.username,
                password: serviceDetails.password,
              }}
            />

            {isAdmin && adminPath && (
              <ServiceAddCredentials
                setService={(data: IService) => {
                  setServiceDetails(data);
                }}
                service={serviceDetails}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetails;

const UserEmailSearch = ({ val, onChange }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const wrapperRef = useRef(null);
  const value = searchResults?.find((user) => user._id === val)?.email;

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setInputValue(query);

    if (query.trim()) {
      setOpen(true);
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/search_user_by_email', {
          params: { email: query },
          withCredentials: true
        });

        if (response.data) {
          setSearchResults(response.data);
          if (response.data.length > 0) {
            setOpen(true);
          }
        }
      } catch (error) {
        console.error('Error searching users:', error);
        toast.error('Failed to search users');
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  useEffect(() => {
    if (value) {
      setInputValue(value);
      setSelectedUser({ email: value });
    }
  }, [value]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setInputValue(user.email);
    onChange(user);
    setOpen(false);
  };

  return (
    <div className="p-3 rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer ">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span className="text-sm">Assign to User</span>
        </div>
      </div>

      {/* Direct approach without Popover */}
      <div ref={wrapperRef} className="relative">
        <div className="flex items-center justify-between w-[220px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search user email..."
            className="w-full bg-transparent outline-none"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => inputValue.trim() && setOpen(true)}
          />
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </div>

        {/* Dropdown menu */}
        {open && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-[220px] rounded-md border border-input bg-background shadow-md mt-1 overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto p-1">
              {loading ? (
                <div className="py-6 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer ${selectedUser?.email === user.email ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                        }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUser?.email === user.email ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col w-full group">
                        <span>{user.email}</span>
                        <span className="text-xs text-muted-foreground max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-200">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  {inputValue ? "No users found" : "Type to search users"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};