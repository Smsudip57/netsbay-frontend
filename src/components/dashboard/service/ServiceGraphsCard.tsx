
import { BarChart, Cpu, Server, HardDriveDownload, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ServiceGraphsCardProps {
  data: Array<{
    time: string;
    cpu: number;
    ram: number;
    disk: number;
    network: number;
  }>;
}

export const ServiceGraphsCard = ({ data }: ServiceGraphsCardProps) => {
  const graphs = [
    { title: "CPU Utilization", icon: Cpu, dataKey: "cpu" },
    { title: "RAM Usage", icon: Server, dataKey: "ram" },
    { title: "Disk I/O", icon: HardDriveDownload, dataKey: "disk" },
    { title: "Network I/O", icon: Network, dataKey: "network" },
  ];

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-1.5 text-neutral-800">
          <BarChart className="h-4 w-4" />
          Resource Utilization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {graphs.map((graph) => (
            <div key={graph.title} className="h-[180px]">
              <h3 className="text-xs font-medium mb-2 flex items-center gap-1.5 text-neutral-700">
                <graph.icon className="h-3.5 w-3.5" />
                {graph.title}
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10 }}
                    tickLine={{ stroke: '#9CA3AF' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={{ stroke: '#9CA3AF' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={graph.dataKey}
                    stroke="#9b87f5"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
