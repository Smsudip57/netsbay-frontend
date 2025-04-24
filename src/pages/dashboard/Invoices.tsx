import React, { useEffect, useState } from "react";
import { FileText, Download, QrCode, Filter, Search, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { DateRange } from "react-day-picker";
import axios from "axios";
import { useAppContext } from "@/context/context";
import { PageSEO } from "@/components/PageSeo";

const Invoices = () => {
  const { transactions, setTransactions, payment, setPayment, generatePDF, user } =
    useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // "today", "month", "all", "custom"
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [filteredPayment, setFilteredPayment] = useState<any[]>([]);

  const payPending = async (paymentId: string) => {
    try {
      const res = await axios.post("/api/payment/pay_pending", {
        paymentId: paymentId,
      })
      if (res?.data) {
        window.location.href = res?.data?.redirectUrl
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const FetchData = async () => {
      try {
        const response = await axios.get("/api/user/transactions", {
          withCredentials: true,
          signal: signal,
        });
        if (response?.data) {
          setTransactions(response.data);
        }
      } catch (error) {
        console.log("error getting info");
      }
      try {
        const response = await axios.get("/api/user/paymentHistory", {
          withCredentials: true,
          signal: signal,
        });
        if (response?.data) {
          setPayment(response.data);
          setFilteredPayment(response.data);
        }
      } catch (error) {
        console.log("error getting info");
      }
    };
    if (transactions.length === 0 || payment.length === 0) {
      FetchData();
    }
    
    return () => {
      abortController.abort();
    };
  }, []);

  // Filter payments based on search and date criteria
  useEffect(() => {
    if (!payment || payment.length === 0) return;
    
    let filtered = user?.role === "user" 
      ? [...payment] 
      : [...payment?.filter((p: any) => p?.user?._id === user?._id)];
    
    // Apply date filtering
    if (dateFilter === "today") {
      const today = startOfToday();
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        return isAfter(invoiceDate, today) || isEqual(invoiceDate, today);
      });
    } else if (dateFilter === "month") {
      const firstDay = startOfMonth(new Date());
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        return isAfter(invoiceDate, firstDay) || isEqual(invoiceDate, firstDay);
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
      
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        return (isAfter(invoiceDate, from) || isEqual(invoiceDate, from)) && 
               (isBefore(invoiceDate, to) || isEqual(invoiceDate, to));
      });
    }
    
    // Apply search query filtering
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(invoice => 
        (invoice?.invoiceId?.toString().toLowerCase() || "").includes(query) ||
        (invoice?.coinAmout?.toString() || "").includes(query)
      );
    }
    
    setFilteredPayment(filtered);
  }, [payment, searchQuery, dateFilter, dateRange, user]);

  const getDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
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

  const Counter = ({ createdAt }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
      // Skip if no createdAt
      if (!createdAt) {
        setTimeLeft("--:--:--");
        return;
      }

      // Convert createdAt to timestamp
      const createdTime = new Date(createdAt).getTime();
      // Calculate expiry time (createdAt + 1 hour)
      const expiryTime = createdTime + (60 * 60 * 1000); // 1 hour in milliseconds

      // Function to update the countdown
      const updateTimer = () => {
        const now = new Date().getTime();
        const difference = expiryTime - now;

        if (difference <= 0) {
          // Timer expired
          setTimeLeft("Expired");
          clearInterval(interval);
          return;
        }

        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        setTimeLeft(`${formattedMinutes}:${formattedSeconds}`);
      };

      // Update timer immediately and then every second
      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }, [createdAt]);

    return (
      <p className="font-mono text-sm font-medium opacity-65" >
        {timeLeft === "Expired" ? (
          <span className="text-red-500">Expired</span>
        ) : (
          <span className="text-amber-600 dark:text-amber-500">{timeLeft}</span>
        )}
      </p>
    );
  };

  return (
    <>
      <PageSEO
        title="My Invoices"
        description="View and manage your NetsBay payment history and invoices"
        keywords={["invoices", "payments", "netcoins", "purchase history"]}
      />
      
      <main className="p-6 flex-1">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
          <h2 className="text-3xl font-bold mb-6">Invoices</h2>

          <Card>
            <CardHeader>
              <CardTitle>NetCoin Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filter UI */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by invoice ID or NetCoin amount..."
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
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>NetCoins</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>GST (18%)</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayment && filteredPayment.length > 0 ? (
                    filteredPayment.map((invoice: any) => (
                      <TableRow key={invoice?.invoiceId}>
                        <TableCell className="font-medium">
                          {invoice?.paymentType !== "Cryptomous"
                            ? invoice?.invoiceId
                            : "No Invoice For Crypto"}
                        </TableCell>
                        <TableCell>{getDate(invoice?.createdAt)}</TableCell>
                        <TableCell>{invoice?.coinAmout} NC</TableCell>
                        <TableCell>
                          {invoice?.paymentType !== "Cryptomous" ? "₹" : "$"}
                          {invoice?.paymentType !== "Cryptomous"
                            ? (invoice?.Price / 1.18)?.toFixed(2)
                            : invoice?.Price}
                        </TableCell>
                        <TableCell>
                          {invoice?.paymentType !== "Cryptomous" ? "₹" : ""}
                          {invoice?.paymentType !== "Cryptomous"
                            ? (invoice?.Price - invoice?.Price / 1.18)?.toFixed(2)
                            : "none"}
                        </TableCell>
                        <TableCell className="font-medium">
                          {invoice?.paymentType !== "Cryptomous" ? "₹" : "$"}
                          {invoice?.Price}
                        </TableCell>
                        <TableCell>
                          {invoice?.status === "Pending" ? (
                            <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">
                              {invoice?.status}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                              {invoice?.status}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {invoice?.paymentType !== "Cryptomous" ? (
                            invoice?.status === "Pending" ? (
                              <div className="flex items-center justify-end gap-2">
                                <Counter createdAt={invoice?.createdAt} />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  style={{ padding: "5px" }}
                                  title="UPI Only"
                                  onClick={()=>payPending(invoice?._id)}
                                >
                                  <QrCode className="h-4 w-4" />
                                  <span className="text-xs">Pay</span>
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => generatePDF(invoice)}
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No Invoice
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        {searchQuery || dateFilter !== "all" ? (
                          <div className="flex flex-col items-center">
                            <p>No invoices match your search criteria</p>
                            <Button 
                              variant="link" 
                              onClick={resetFilters}
                              className="mt-2"
                            >
                              Clear Filters
                            </Button>
                          </div>
                        ) : (
                          "No invoices found"
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

export default Invoices;