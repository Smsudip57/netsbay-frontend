
import { useState } from "react";
import { BarChart3, Server, Activity, Bell, Wallet, Calendar, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const announcements = [
  {
    id: 1,
    subject: "System Maintenance Schedule",
    body: "Scheduled maintenance will be performed on Saturday, March 15th from 2 AM to 4 AM UTC.",
    date: "2024-03-10",
    priority: "high"
  },
  {
    id: 2,
    subject: "New Features Released",
    body: "We've added new monitoring tools and improved the dashboard interface.",
    date: "2024-03-08",
    priority: "medium"
  },
  {
    id: 3,
    subject: "Security Update",
    body: "Important security patches have been applied to all services.",
    date: "2024-03-05",
    priority: "high"
  },
  {
    id: 4,
    subject: "Platform Upgrade Notice",
    body: "Platform improvements scheduled for next week.",
    date: "2024-03-03",
    priority: "medium"
  },
  {
    id: 5,
    subject: "Holiday Support Hours",
    body: "Modified support hours during upcoming holidays.",
    date: "2024-03-02",
    priority: "low"
  },
  {
    id: 6,
    subject: "New Service Regions",
    body: "Additional service regions now available.",
    date: "2024-03-01",
    priority: "medium"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30";
    case "medium":
      return "bg-yellow-50 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30";
    default:
      return "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30";
  }
};

const Analytics = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const announcementsPerPage = 5;
  
  // Calculate pagination
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = announcements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );
  const totalPages = Math.ceil(announcements.length / announcementsPerPage);

  return (
    <main className="p-6 flex-1">
      <div className="bg-gradient-to-b from-white/50 to-white/30 dark:from-slate-900/50 dark:to-slate-900/30 backdrop-blur-xl rounded-lg p-6 border border-gray-100/50 dark:border-slate-700/50 shadow-sm">
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
            Analytics & Announcements
          </h2>
          <p className="text-muted-foreground mt-1">
            Monitor your services and stay updated with latest announcements
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">My Services</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +1 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Uptime</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Billing Period</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Days remaining
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average across services
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="announcements" className="space-y-4">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="announcements" className="text-sm">
                <Bell className="h-4 w-4 mr-2" />
                Latest Announcements
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance Metrics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements" className="space-y-4">
              {currentAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold">{announcement.subject}</CardTitle>
                      <div className="text-sm text-muted-foreground">{announcement.date}</div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${getPriorityColor(announcement.priority)} border`}>
                      {announcement.priority}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{announcement.body}</p>
                  </CardContent>
                </Card>
              ))}
              
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-3 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Services Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="p-4">
                      <div className="text-sm font-medium mb-2">Average Response Time</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">45ms</div>
                      <div className="text-xs text-muted-foreground">-5ms from last week</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm font-medium mb-2">Total Bandwidth Usage</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.2 TB</div>
                      <div className="text-xs text-muted-foreground">+0.3 TB from last month</div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
