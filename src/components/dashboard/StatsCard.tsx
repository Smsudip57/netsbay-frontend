import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  variant?: 'default' | 'info' | 'warning' | 'danger' | 'success';
}

export function StatsCard({ title, value, icon, description, variant = 'default' }: StatsCardProps) {
  return (
    <Card className="bg-white/80 shadow-md hover:shadow-xl transition-all duration-300 border border-border/30 dark:glass-card dark:hover:bg-gray-800/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-icon hover:opacity-80 transition-colors">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}