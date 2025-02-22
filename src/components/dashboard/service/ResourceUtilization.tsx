
import { Cpu, Server, HardDrive, Globe } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResourceUtilizationProps {
  utilization: {
    cpu: number;
    ram: number;
    disk: number;
    network: number;
  };
}

interface ResourceBarProps {
  label: string;
  value: number;
  icon: any;
}

const ResourceBar = ({ label, value, icon: Icon }: ResourceBarProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="text-blue-400">{value}%</span>
    </div>
    <Progress value={value} className="h-2" />
  </div>
);

export const ResourceUtilization = ({ utilization }: ResourceUtilizationProps) => {
  return (
    <div className="mb-6 p-6 rounded-xl bg-card/60 backdrop-blur-xl border dark:border-white/5">
      <h3 className="text-lg font-medium text-foreground mb-6">Resource Utilization</h3>
      <div className="space-y-6">
        <ResourceBar label="CPU Usage" value={utilization.cpu} icon={Cpu} />
        <ResourceBar label="Memory Usage" value={utilization.ram} icon={Server} />
        <ResourceBar label="Storage Usage" value={utilization.disk} icon={HardDrive} />
        <ResourceBar label="Network Usage" value={utilization.network} icon={Globe} />
      </div>
    </div>
  );
};
