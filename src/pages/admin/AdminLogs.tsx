import { useState, useEffect } from "react";
import { format, startOfToday, startOfMonth, isAfter, isBefore, isEqual } from "date-fns";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { Search, Calendar as CalendarIcon, Clock, RefreshCcw } from "lucide-react";
import { PageSEO } from "@/components/PageSeo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface AdminLog {
  _id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  userName: string;
  userEmail: string;
  action: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AdminLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/logs", {
        withCredentials: true,
      });
      if (response?.data) {
        setLogs(response.data);
        setFilteredLogs(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs based on search query and date range
  useEffect(() => {
    if (!logs.length) return;

    let filtered = [...logs];

    // Apply date filtering
    if (dateFilter === "today") {
      const today = startOfToday();
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return isAfter(logDate, today) || isEqual(logDate, today);
      });
    } else if (dateFilter === "month") {
      const firstDay = startOfMonth(new Date());
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return isAfter(logDate, firstDay) || isEqual(logDate, firstDay);
      });
    } else if (dateFilter === "custom" && dateRange?.from) {
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      
      let to;
      if (dateRange.to) {
        to = new Date(dateRange.to);
        to.setHours(23, 59, 59, 999);
      } else {
        to = new Date(from);
        to.setHours(23, 59, 59, 999);
      }
      
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        return (isAfter(logDate, from) || isEqual(logDate, from)) && 
               (isBefore(logDate, to) || isEqual(logDate, to));
      });
    }
    
    // Apply search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      filtered = filtered.filter(log => {
        switch(searchFilter) {
          case "admin":
            return log.adminName.toLowerCase().includes(query) || 
                   log.adminEmail.toLowerCase().includes(query);
          case "user":
            return log.userName.toLowerCase().includes(query) || 
                   log.userEmail.toLowerCase().includes(query);
          case "action":
            return log.action.toLowerCase().includes(query);
          default:
            return log.adminName.toLowerCase().includes(query) || 
                   log.adminEmail.toLowerCase().includes(query) ||
                   log.userName.toLowerCase().includes(query) || 
                   log.userEmail.toLowerCase().includes(query) ||
                   log.action.toLowerCase().includes(query);
        }
      });
    }

    setFilteredLogs(filtered);
  }, [logs, searchQuery, searchFilter, dateFilter, dateRange]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yyyy, h:mm a");
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSearchFilter("all");
    setDateFilter("all");
    setDateRange({
      from: undefined,
      to: undefined,
    });
  };

  return (
    <>
      <PageSEO
        title="Admin Logs"
        description="View and monitor all admin actions in the Netsbay system"
        keywords={["admin", "logs", "audit", "activity"]}
      />
      
      <main className="p-6 flex-1">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Activity Logs</h1>
            <Button 
              variant="outline" 
              onClick={fetchLogs}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filter UI */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={searchFilter}
                  onValueChange={setSearchFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={dateFilter}
                  onValueChange={setDateFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Date Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                {dateFilter === "custom" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="whitespace-nowrap"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd/MM")} -{" "}
                              {format(dateRange.to, "dd/MM")}
                            </>
                          ) : (
                            format(dateRange.from, "dd MMM yyyy")
                          )
                        ) : (
                          <span>Pick dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => setDateRange(range)}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                
                {(searchQuery !== "" || dateFilter !== "all" || searchFilter !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          Date & Time
                        </div>
                      </TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <TableRow key={log._id}>
                          <TableCell className="font-medium">
                            {formatDateTime(log.timestamp)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{log.adminName}</span>
                              <span className="text-xs text-muted-foreground">{log.adminEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{log.userName}</span>
                              <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                              {log.action}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          {loading ? (
                            "Loading logs..."
                          ) : searchQuery || dateFilter !== "all" ? (
                            <div className="flex flex-col items-center">
                              <p>No logs match your search criteria</p>
                              <Button 
                                variant="link" 
                                onClick={resetFilters}
                                className="mt-2"
                              >
                                Clear Filters
                              </Button>
                            </div>
                          ) : (
                            "No logs found"
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}