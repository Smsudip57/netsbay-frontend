
import { Server, Play, StopCircle, RefreshCw, Key, DatabaseZap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type serviceType = 'Internal Linux' | 'External Linux' | 'Internal RDP' | 'External RDP';

interface ServiceActionsCardProps {
  serviceType: string;
  vmId?: string;
  status: string;
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "outline" | "default" | "destructive";
  className?: string;
}

const ActionButton = ({ icon: Icon, label, onClick, disabled, variant = "outline", className }: ActionButtonProps) => (
  <Button
    variant={variant}
    size="sm"
    className={`flex items-center gap-1.5 text-sm ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </Button>
);

export const ServiceActionsCard = ({ serviceType, vmId, status }: ServiceActionsCardProps) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showRebuildDialog, setShowRebuildDialog] = useState(false);
  const hasVmId = !!vmId;
  const isRunning = status === 'active';

  const handlePasswordChange = () => {
    // Here you would make an API call to change the password
    toast.success("Password changed successfully");
    setShowPasswordChange(false);
    setNewPassword("");
  };

  const handleRebuildRequest = () => {
    // Here you would make an API call to initiate rebuild
    toast.success("Rebuild request submitted successfully");
    setShowRebuildDialog(false);
  };

  // Then replace your actions logic with this:
const getServiceActions = () => {
  const isInternal = serviceType.includes('Internal');
  const isWindows = serviceType.includes('RDP');
  
  // Internal services (both Linux and Windows)
  if (isInternal) {
    return [
      { 
        icon: Play, 
        label: "Start", 
        onClick: () => console.log("Start clicked"),
        disabled: isRunning,
        variant: "outline" as const
      },
      { 
        icon: StopCircle, 
        label: "Stop", 
        onClick: () => console.log("Stop clicked"),
        disabled: !isRunning,
        variant: "outline" as const
      },
      { 
        icon: RefreshCw, 
        label: "Reboot", 
        onClick: () => console.log("Reboot clicked"),
        disabled: !isRunning,
        variant: "outline" as const
      },
      { 
        icon: Key, 
        label: "Change Password", 
        onClick: () => setShowPasswordChange(!showPasswordChange),
        variant: "outline" as const
      },
      ...(hasVmId ? [{
        icon: DatabaseZap,
        label: "REBUILD Request",
        onClick: () => setShowRebuildDialog(true),
        variant: "outline" as const
      }] : []),
    ];
  }
  // External Linux
  else if (!isInternal && !isWindows) {
    return [
      { 
        icon: RefreshCw, 
        label: "Reboot", 
        onClick: () => console.log("Reboot clicked"),
        disabled: !isRunning,
        variant: "outline" as const
      },
      { 
        icon: Key, 
        label: "Change Password", 
        onClick: () => setShowPasswordChange(!showPasswordChange),
        variant: "outline" as const
      },
      ...(hasVmId ? [{
        icon: DatabaseZap,
        label: "REBUILD Request",
        onClick: () => setShowRebuildDialog(true),
        variant: "outline" as const
      }] : []),
    ];
  }
  // External Windows (RDP)
  else {
    return [
      { 
        icon: RefreshCw, 
        label: "Request Reboot", 
        onClick: () => console.log("Request Reboot clicked"),
        variant: "outline" as const
      },
      { 
        icon: Key, 
        label: "Request Password Change", 
        onClick: () => console.log("Request password change"),
        variant: "outline" as const
      },
      ...(hasVmId ? [{
        icon: DatabaseZap,
        label: "Request Rebuild",
        onClick: () => setShowRebuildDialog(true),
        variant: "outline" as const
      }] : []),
    ];
  }
};

// Replace your actions constant with:
const actions = getServiceActions();
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
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
              disabled={action.disabled}
              variant={action.variant}
            />
          ))}
        </div>

        {showPasswordChange && (
          <div className="mt-4 p-4 border rounded-lg bg-background/50">
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handlePasswordChange} size="sm">
                Save Password
              </Button>
            </div>
          </div>
        )}

        <Dialog open={showRebuildDialog} onOpenChange={setShowRebuildDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Rebuild Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to submit a rebuild request? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowRebuildDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleRebuildRequest}>
                Confirm Rebuild
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
