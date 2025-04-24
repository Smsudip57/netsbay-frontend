import { DollarSign, ArrowUpDown, Server, Shield, Cpu, Search, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { format, startOfToday, startOfMonth, isAfter, isBefore, isEqual } from "date-fns";
import axios from "axios";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useAppContext } from "@/context/context";
import { PageSEO } from "@/components/PageSeo";

const Transactions = () => {
  const { transactions, setTransactions } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/user/transactions", {
          withCredentials: true,
        });
        if (response?.data) {
          setTransactions(response.data);
          setFilteredTransactions(response.data);
        }
      } catch (error) {
        console.log("Error fetching transactions:", error);
      }
    };

    if (transactions.length === 0) {
      fetchTransactions();
    } else {
      setFilteredTransactions(transactions);
    }
  }, [transactions, setTransactions]);

  // Filter transactions based on search query and date filter
  useEffect(() => {
    if (!transactions || transactions.length === 0) return;
    
    let filtered = [...transactions];
    
    // Apply date filtering
    if (dateFilter === "today") {
      const today = startOfToday();
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return isAfter(transactionDate, today) || isEqual(transactionDate, today);
      });
    } else if (dateFilter === "month") {
      const firstDay = startOfMonth(new Date());
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return isAfter(transactionDate, firstDay) || isEqual(transactionDate, firstDay);
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
      
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        return (isAfter(transactionDate, from) || isEqual(transactionDate, from)) && 
               (isBefore(transactionDate, to) || isEqual(transactionDate, to));
      });
    }
    
    // Apply search query filtering
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => 
        (transaction?.transactionId?.toLowerCase() || "").includes(query) ||
        (transaction?.description?.toLowerCase() || "").includes(query) ||
        (transaction?.type?.toLowerCase() || "").includes(query)
      );
    }
    
    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, dateFilter, dateRange]);

  const getDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDateFilter("all");
    setDateRange({
      from: undefined,
      to: undefined,
    });
  };

  return (
    <>
      <PageSEO
        title="Transaction History"
        description="View your NetsBay service purchase transaction history"
        keywords={["transactions", "services", "history", "netcoins"]}
      />
      
      <main className="p-6 flex-1">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
          <h2 className="text-3xl font-bold mb-6">
            Service Purchase Transactions
          </h2>

          <Card>
            <CardHeader>
              <CardTitle>Recent Service Purchases</CardTitle>
            </CardHeader>
            <CardContent
              className="relative max-h-[68vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
              style={{
                scrollbarWidth: "thin",
                msOverflowStyle: "none",
              }}
            >
              {/* Search and Filter UI */}
              <div className="flex flex-col md:flex-row gap-4 mb-6 mt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, description or service type..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={dateFilter}
                    onValueChange={setDateFilter}
                  >
                    <SelectTrigger className="w-[140px]">
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
                          size="sm"
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
                  
                  {(searchQuery !== "" || dateFilter !== "all") && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 mb-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/6">Transaction ID</TableHead>
                      <TableHead className="w-1/6">Date</TableHead>
                      <TableHead className="w-1/6">Service Type</TableHead>
                      <TableHead className="w-2/6">Description</TableHead>
                      <TableHead className="w-1/6 text-right">
                        Amount (NC)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              <Table>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction: any) => (
                      <TableRow key={transaction?.transactionId}>
                        <TableCell className="w-1/6 font-medium">
                          {transaction?.transactionId}
                        </TableCell>
                        <TableCell className="w-1/6">
                          {getDate(transaction?.createdAt)}
                        </TableCell>
                        <TableCell className="w-1/6">
                          <span className="inline-flex items-center gap-2">
                            {transaction?.type}
                          </span>
                        </TableCell>
                        <TableCell className="w-2/6">
                          {transaction?.description}
                        </TableCell>
                        <TableCell className="w-1/6 text-right">
                          <span className={`inline-flex items-center gap-1 font-medium ${transaction?.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                            {transaction?.amount} NC
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        {searchQuery || dateFilter !== "all" ? (
                          <div className="flex flex-col items-center">
                            <p>No transactions match your search criteria</p>
                            <Button 
                              variant="link" 
                              onClick={resetFilters}
                              className="mt-2"
                            >
                              Clear Filters
                            </Button>
                          </div>
                        ) : (
                          "No transactions found"
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Transactions;