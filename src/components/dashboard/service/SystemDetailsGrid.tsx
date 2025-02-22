
import { Terminal, Globe, Cpu, Server, HardDrive } from "lucide-react";
import { Card } from "@/components/ui/card";

interface SystemDetailsGridProps {
  details: {
    type: string;
    ipSet: string;
    cpu: string;
    ram: string;
    storage: string;
  };
}

export const SystemDetailsGrid = ({ details }: SystemDetailsGridProps) => {
  const items = [
    { icon: Terminal, label: "OS Type", value: details.type },
    { icon: Globe, label: "IP Set", value: details.ipSet },
    { icon: Cpu, label: "CPU", value: details.cpu },
    { icon: Server, label: "RAM", value: details.ram },
    { icon: HardDrive, label: "Storage", value: details.storage },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <Card key={index} className="p-5 bg-card/60 border shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2.5 text-muted-foreground mb-2.5">
            <item.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          <p className="text-base font-medium text-foreground">{item.value}</p>
        </Card>
      ))}
    </div>
  );
};
