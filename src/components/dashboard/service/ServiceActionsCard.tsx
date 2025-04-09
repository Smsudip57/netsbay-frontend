import {
  Server,
  Play,
  StopCircle,
  RefreshCw,
  Key,
  DatabaseZap,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { IService } from "@/pages/dashboard/ServiceDetails";
import axios from "axios";
import { useLocation } from "react-router-dom";

type serviceType =
  | "Internal Linux"
  | "External Linux"
  | "Internal RDP"
  | "External RDP";

interface ServiceActionsCardProps {
  serviceType: string;
  vmId?: string;
  status: string;
  actions?: () => string[];
  service: IService;
  setService: (service: IService) => void;
  request?: any;
  setRequest?: (request: any) => void;
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?:
    | "link"
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost";
  className?: string;
}

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled,
  variant = "outline",
  className,
}: ActionButtonProps) => (
  <Button
    variant={variant}
    size="sm"
    className={`flex items-center gap-1.5 text-sm ${className} cursor-pointer`}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </Button>
);

export const ServiceActionsCard = ({
  serviceType,
  vmId,
  status,
  actions,
  service,
  setService,
  request,
  setRequest,
}: ServiceActionsCardProps) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showRebuildDialog, setShowRebuildDialog] = useState(false);
  const hasVmId = !!vmId;
  const isRunning = status === "active";
  const [actionloading, setActionLoading] = useState({
    group: false,
    rebuild: false,
  });
  const [groupCounter, setGroupCounter] = useState(29);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [npassError, setNpassError] = useState(false);
  const [terminationLoading, setTerminationLoading] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");

  // const handlePasswordChange = () => {
  //   // Here you would make an API call to change the password
  //   toast.success("Password changed successfully");
  //   setShowPasswordChange(false);
  //   setNewPassword("");
  // };

  const handleRebuildRequest = () => {
    toast.success("Rebuild request submitted successfully");
    setShowRebuildDialog(false);
  };

  const ActionCall = async (action: string) => {
    if (action === "rebuild") {
      setActionLoading((prev) => ({ ...prev, [action]: true }));
    } else {
      if (action === "changepass") {
        if (!newPassword) {
          setShowPasswordChange(true);
          return;
        } else {
          if (
            newPassword.length < 10 ||
            !/[A-Z]/.test(newPassword) ||
            !/[a-z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword) ||
            !/[@#]/.test(newPassword)
          ) {
            toast.error(
              "Password must be at least 10 characters long and contain uppercase, lowercase, number, and @ or #."
            );
            setNpassError(true);
            return;
          }
        }
      }
      setActionLoading((prev) => ({ ...prev, group: true }));
    }
    try {
      const response = await axios.post(
        "/api/user/action",
        {
          serviceId: service?.serviceId,
          action: action,
          password: newPassword,
        },
        {
          withCredentials: true,
        }
      );
      if (response?.data) {
        toast.success(response?.data?.message);
        console.log(response?.data?.service);
        if (response?.data?.service) {
          setService(response?.data?.service);
        }
      }
      if (action === "changepass") {
        setNewPassword("");
        setShowPasswordChange(false);
        setNpassError(false);
      }
    } catch (error) {
      console.error(error?.response?.data || "Something went wrong");
    } finally {
      if (action === "changepass") {
        setNpassError(true);
      }
      if (action === "rebuild") {
        setActionLoading((prev) => ({ ...prev, [action]: false }));
      } else {
        if (intervalId !== null) {
          clearInterval(intervalId);
        }

        const newIntervalId = window.setInterval(() => {
          setGroupCounter((prev) => {
            if (prev <= 0) {
              clearInterval(newIntervalId);
              return 29;
            }
            return prev - 1;
          });
        }, 1000);

        setIntervalId(newIntervalId);
        setTimeout(() => {
          clearInterval(newIntervalId);
          setIntervalId(null);
          setActionLoading((prev) => ({ ...prev, group: false }));
          setGroupCounter(29);
        }, 30000);
      }
    }
  };

  const Ternimation = async () => {
    if (!newPassword && service?.status !== "terminated") {
      setShowPasswordChange(true);
      return;
    }
    setTerminationLoading(true);
    try {
      await axios
        .post(
          "/api/admin/update_service",
          {
            serviceId: service?.serviceId,
            terminate: service?.status === "terminated" ? false : true,
            terminationReason: newPassword,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res?.data) {
            toast.success(res?.data?.message);
            setService(res?.data?.service);
            setShowPasswordChange(false);
            setNpassError(false);
          }
        });
    } catch (error) {
      console.error(error?.response?.data || "Something went wrong");
      setNpassError(true);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setNewPassword("");
      setTerminationLoading(false);
    }
  };

  const getServiceActions = () => {
    const isInternal = serviceType.includes("Internal");
    const isWindows = serviceType.includes("RDP");

    const adminRequestAction = async (val: boolean) => {
      try {
        const response = await axios.post(
          "/api/admin/process_request",
          {
            requestId: request?._id,
            approve: val,
          },
          {
            withCredentials: true,
          }
        );
        if (response?.data) {
          console.log(response?.data);
          setRequest(response?.data?.request);
          toast.success(response?.data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message|| "Something went wrong");
      }
    };

    return actions()?.map((action) => {
      switch (action) {
        case "reboot":
          return {
            icon: RefreshCw,
            label: `${
              actionloading?.group ? ` (${groupCounter}) Reboot` : "Reboot"
            }`,
            onClick: () => ActionCall(action),
            disabled: actionloading?.group,
          };
        case "stop":
          return {
            icon: StopCircle,
            label: `${
              actionloading?.group ? ` (${groupCounter}) Stop` : "Stop"
            }`,
            onClick: () => ActionCall(action),
            disabled: actionloading?.group,
          };
        case "start":
          return {
            icon: Play,
            label: `${
              actionloading?.group ? ` (${groupCounter}) Start` : "Start"
            }`,
            onClick: () => ActionCall(action),
            disabled: actionloading?.group,
          };
        case "changepass":
          return {
            icon: Key,
            label: `${
              actionloading?.group
                ? ` (${groupCounter}) Change Password`
                : "Change Password"
            }`,
            onClick: () => ActionCall(action),
            disabled: actionloading?.group,
          };
        case "rebuild":
          return {
            icon: DatabaseZap,
            label: service?.rebuildRequestExists ? "Pending" : "Rebuild",
            onClick: () => ActionCall(action),
            disabled: actionloading?.rebuild || service?.rebuildRequestExists,
          };
        case "approveed":
          return {
            icon: Check,
            label: `${
              request?.status === "Approved" ? "Marked" : "Mark"
            } as Approved`,
            onClick: () => adminRequestAction(true),
            disabled: request?.status !== "Pending",
            variant:
              request?.status === "Pending"
                ? "default"
                : request?.status === "Approved"
                ? "secondary"
                : "outline",
          };
        case "reject":
          return {
            icon: X,
            label: `${
              request?.status === "Rejected" ? "Marked" : "Mark"
            }  as Rejected`,
            onClick: () => adminRequestAction(false),
            disabled: request?.status !== "Pending",
            variant:
              request?.status === "Pending"
                ? "destructive"
                : request?.status === "Rejected"
                ? "secondary"
                : "outline",
          };
        case "terminate":
          return {
            icon: service?.status === "terminated" ? Play : X,
            label:
              service?.status === "terminated" ? "Reactivate" : "Terminate",
            onClick: () => Ternimation(),
            disabled: terminationLoading,
            variant:
              service?.status === "terminated" ? "default" : "destructive",
          };
        default:
          return null;
      }
    });
  };

  // Replace your actions constant with:
  const actionss = getServiceActions();
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-1.5 text-foreground dark:text-white">
          <Server className="h-4 w-4" />
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actionss.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              variant={
                action.variant as
                  | "link"
                  | "outline"
                  | "default"
                  | "destructive"
                  | "secondary"
                  | "ghost"
              }
            />
          ))}
        </div>

        {showPasswordChange && (
          <div
            className={`mt-4 p-4 border ${
              npassError ? "border-red-500" : ""
            } rounded-lg bg-background/50`}
          >
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={
                  isAdmin ? "Enter termination reason" : "Enter new password"
                }
                value={newPassword}
                onChange={(e) => {
                  setNpassError(false);
                  setNewPassword(e.target.value);
                }}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (isAdmin) {
                    Ternimation();
                  } else {
                    ActionCall("changepass");
                  }
                }}
                size="sm"
                disabled={terminationLoading}
              >
                {isAdmin ? `Terminate` : "Save Password"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
