import React, { useEffect, useState } from "react";
import { FileText, Download, QrCode, Filter } from "lucide-react";
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
import axios from "axios";
import { useAppContext } from "@/context/context";

const Invoices = () => {
  const { transactions, setTransactions, payment, setPayment, generatePDF, user } =
    useAppContext();


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
        }
      } catch (error) {
        console.log("error getting info");
      }
    };
    if (transactions.length === 0 || payment.length === 0) {
      FetchData();
    }
  }, []);

  const getDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h2 className="text-3xl font-bold mb-6">Invoices</h2>

        <Card>
          <CardHeader>
            <CardTitle>NetCoin Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
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
                {(user?.role === "user" ? payment : payment?.filter((payment: any) => payment?.user?._id === user?._id))?.map((invoice: any) => (
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
                        // {invoice?.paymentType === "Cryptomous" ? (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Invoices;
