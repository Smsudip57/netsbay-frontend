
import { Clock, Server, ExternalLink, RefreshCw, Play, Wrench, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const pendingRequests = [
  {
    id: "REQ-001",
    title: "Ubuntu Server Configuration",
    serviceId: 1,
    specs: "2 vCPU / 4GB RAM / 50GB Storage",
    status: "pending",
    timestamp: "2 hours ago",
    type: "New Service Setup"
  },
  {
    id: "REQ-002",
    title: "Windows VPS Upgrade",
    serviceId: 2,
    specs: "4 vCPU / 8GB RAM / 100GB Storage",
    status: "pending",
    timestamp: "5 hours ago",
    type: "Resource Upgrade"
  }
];

const actionRequests = [
  {
    id: "ACT-001",
    title: "Server Restart Request",
    serviceId: 3,
    specs: "2 vCPU / 4GB RAM / 50GB Storage",
    status: "pending",
    timestamp: "1 hour ago",
    type: "Restart",
    actionIcon: RefreshCw
  },
  {
    id: "ACT-002",
    title: "Service Start Request",
    serviceId: 4,
    specs: "4 vCPU / 8GB RAM / 100GB Storage",
    status: "in-progress",
    timestamp: "3 hours ago",
    type: "Start",
    actionIcon: Play
  }
];

const getActionIcon = (type: string) => {
  switch (type) {
    case "Start":
      return Play;
    case "Restart":
      return RefreshCw;
    case "Rebuild":
      return Wrench;
    case "Renew":
      return Calendar;
    default:
      return Server;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30";
    case "in-progress":
      return "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30";
    default:
      return "bg-gray-50 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30";
  }
};

const RequestCard = ({ request, isAction = false }: { request: typeof pendingRequests[0] | typeof actionRequests[0], isAction?: boolean }) => {
  const ActionIcon = isAction ? getActionIcon(request.type) : Server;
  
  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary dark:bg-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-foreground">{request.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="h-4 w-4" />
            <span>Service ID: {request.serviceId}</span>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(request.status)}`}>
          {request.status}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{request.timestamp}</span>
            </div>
            {isAction && (
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 rounded-full">
                <ActionIcon className="h-4 w-4" />
                <span className="text-xs font-medium">{request.type}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-2 border-t dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{request.specs}</span>
            </div>
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link to={`/dashboard/services/${request.serviceId}`}>
                View Service
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Requests = () => {
  return (
    <main className="p-6 flex-1">
      <div className="bg-gradient-to-b from-white/50 to-white/30 dark:from-slate-900/50 dark:to-slate-900/30 backdrop-blur-xl rounded-lg p-6 border border-gray-100/50 dark:border-slate-700/50 shadow-sm">
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            Service Request
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your service requests and actions
          </p>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="pending" className="text-sm">Pending Service Requests</TabsTrigger>
            <TabsTrigger value="actions" className="text-sm">Service Actions Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            {actionRequests.map((request) => (
              <RequestCard key={request.id} request={request} isAction={true} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Requests;
