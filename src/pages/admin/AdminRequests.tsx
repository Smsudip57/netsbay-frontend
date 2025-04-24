import {
  Clock,
  Server,
  ExternalLink,
  RefreshCw,
  Play,
  Wrench,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAppContext } from "@/context/context";

const getActionIcon = (type: string) => {
  switch (type) {
    case "Rebuild":
      return Wrench;
    case "Renew":
      return Calendar;
    case "Service":
      return Server;
    default:
      return () => <></>;
  }
};

const getActionColor = (type: string) => {
  switch (type) {
    case "Rebuild":
      return "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30";
    case "Renew":
      return "bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30";
    case "Service":
      return "bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30";
    default:
      return "bg-gray-50 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30";
    case "approved":
      return "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30";
    default:
      return "bg-gray-50 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30";
  }
};

const RequestCard = ({ request, isAction = false }: any) => {
  const ActionIcon = getActionIcon(request?.requestType);
  console.log(request?.requestType);
  const { getDate } = useAppContext();

  return (
    <Card className="mb-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary dark:bg-slate-900/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold text-foreground">{`Service ${request?.requestType} Request`}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Server className="h-4 w-4" />
            <span>Service ID: {request?.serviceMongoID?.serviceId}</span>
          </div>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
            request?.status?.toLowerCase()
          )}`}
        >
          {request.status}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {getDate(request?.createdAt)}
              </span>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-1 ${getActionColor(
                request?.requestType
              )} rounded-full`}
            >
              <ActionIcon className="h-4 w-4" />
              <span className="text-xs font-medium">
                {request?.requestType}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {`${request?.productMongoID?.cpu} vCPU / ${request?.productMongoID?.ram}GB RAM / ${request?.productMongoID?.storage}GB Storage`}
              </span>
            </div>
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link to={`/admin/requests/${request?._id}`}>
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

const AdminRequests = () => {
  const { requests, setRequests } = useAppContext();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchRequests = async () => {
      try {
        const response = await axios.get("/api/admin/requests", {
          withCredentials: true,
          signal: signal,
        });
        if (response?.data) {
          setRequests(response?.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to fetch requests");
      }
    };
    if (requests?.length === 0 || !requests) {
      fetchRequests();
    }
    return () => {
      abortController.abort();
    };
  }, []);
  
  const prendingRequests = requests?.filter(
    (request: any) => request.requestType === "Service"
  );
  const actionRequests = requests?.filter(
    (request: any) => request.requestType !== "Service"
  );

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h1 className="text-3xl font-bold mb-6">Request Management</h1>
        <Card className="p-6">
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="pending" className="text-sm">
                Pending Service Requests
              </TabsTrigger>
              <TabsTrigger value="actions" className="text-sm">
                All Service Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {prendingRequests?.map((request: any) => (
                <RequestCard key={request._id} request={request} />
              ))}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              {actionRequests?.map((request: any) => (
                <RequestCard key={request._id} request={request} />
              ))}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
};

export default AdminRequests;
