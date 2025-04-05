import React, { useEffect } from "react";
import { FileText, Download, QrCode } from "lucide-react";
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
  const { transactions, setTransactions, payment, setPayment, generatePDF } =
    useAppContext();
  const invoices = [
    {
      id: "INV-001",
      date: "2024-02-20",
      netcoins: 200,
      subtotal: 200.0,
      gst: 36.0, // 18% GST
      total: 236.0,
      status: "Paid",
    },
    {
      id: "INV-002",
      date: "2024-02-15",
      netcoins: 500,
      subtotal: 500.0,
      gst: 90.0, // 18% GST
      total: 590.0,
      status: "Paid",
    },
  ];

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
                {payment?.map((invoice: any) => (
                  <TableRow key={invoice?.invoiceId}>
                    <TableCell className="font-medium">
                      {invoice?.paymentMethod === "Phonepe"
                        ? invoice?.invoiceId
                        : "No Invoice For Crypto"}
                    </TableCell>
                    <TableCell>{getDate(invoice?.createdAt)}</TableCell>
                    <TableCell>{invoice?.coinAmout} NC</TableCell>
                    <TableCell>
                      {invoice?.paymentType === "Phonepe" ? "₹" : "$"}
                      {invoice?.paymentType === "Phonepe"
                        ? (invoice?.Price / 1.18)?.toFixed(2)
                        : invoice?.Price}
                    </TableCell>
                    <TableCell>
                      {invoice?.paymentType === "Phonepe" ? "₹" : ""}
                      {invoice?.paymentType === "Phonepe"
                        ? (invoice?.Price - invoice?.Price / 1.18)?.toFixed(2)
                        : "none"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {invoice?.paymentType === "Phonepe" ? "₹" : "$"}
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
                      {invoice?.paymentType === "Phonepe" ? (
                        // {invoice?.paymentType === "Cryptomous" ? (
                        invoice?.status === "Pending" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            style={{ padding: "5px" }}
                            title="UPI Only"
                          >
                            <QrCode className="h-4 w-4" />
                            <span className="text-xs">Pay</span>
                          </Button>
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
