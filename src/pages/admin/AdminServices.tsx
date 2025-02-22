import { useState } from "react";
import { Server, CheckCircle, CircleSlash, XCircle, Filter, List, Grid, Globe, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

// Mock data for demonstration - admin version includes more details
const mockServices = [
  {
    id: 1,
    name: "VPS Server #1",
    type: "Ubuntu",
    status: "online",
    ip: "192.168.1.1",
    expiryDate: "2024-12-31",
    userId: "user123",
    userEmail: "user1@example.com",
    specs: {
      cpu: "2 vCPU",
      ram: "4 GB",
      storage: "50 GB",
    },
  },
  {
    id: 2,
    name: "VPS Server #2",
    type: "CentOS",
    status: "stopped",
    ip: "192.168.1.2",
    expiryDate: "2024-12-31",
    userId: "user456",
    userEmail: "user2@example.com",
    specs: {
      cpu: "4 vCPU",
      ram: "8 GB",
      storage: "100 GB",
    },
  },
  {
    id: 3,
    name: "VPS Server #3",
    type: "Windows",
    status: "expired",
    ip: "192.168.1.3",
    expiryDate: "2024-06-30",
    userId: "user789",
    userEmail: "user3@example.com",
    specs: {
      cpu: "2 vCPU",
      ram: "4 GB",
      storage: "80 GB",
    },
  },
];

const AdminServices = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewType, setViewType] = useState<"list" | "cards">("list");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "stopped":
        return <CircleSlash className="h-4 w-4 text-yellow-500" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-orange-500" />;
      case "terminated":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredServices = mockServices.filter((service) => {
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    const matchesType = typeFilter === "all" || service.type === typeFilter;
    return matchesStatus && matchesType;
  });

  const renderListView = (services: typeof mockServices) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>IP Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {service.ip}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {getStatusIcon(service.status)}
                <span className="capitalize">{service.status}</span>
              </div>
            </TableCell>
            <TableCell>
              <Link to={`/admin/services/${service.id}`} className="hover:underline">
                {service.name}
              </Link>
            </TableCell>
            <TableCell>{service.type}</TableCell>
            <TableCell>
              <div className="text-sm">
                <div>{service.userEmail}</div>
                <div className="text-muted-foreground">{service.userId}</div>
              </div>
            </TableCell>
            <TableCell>{service.expiryDate}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCardView = (services: typeof mockServices) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-bold">{service.ip}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(service.status)}
              <span className="text-sm capitalize">{service.status}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{service.type}</span>
              </div>
              <div className="text-sm">
                <div>User: {service.userEmail}</div>
                <div className="text-muted-foreground">ID: {service.userId}</div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{service.expiryDate}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-destructive">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">All Services</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewType === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewType("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === "cards" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewType("cards")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="stopped">Stopped</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                <SelectItem value="CentOS">CentOS</SelectItem>
                <SelectItem value="Windows">Windows</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {viewType === "list" ? renderListView(filteredServices) : renderCardView(filteredServices)}
      </div>
    </main>
  );
};

export default AdminServices;