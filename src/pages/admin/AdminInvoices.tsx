import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useAppContext } from "@/context/context";
import { FileText, Download, QrCode, Plus, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const AdminInvoices = () => {
  const { transactions, setTransactions, payment, setPayment, generatePDF } =
    useAppContext();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const CustomInvoiceForm = ({ onBack }: { onBack: () => void }) => {
    const [formData, setFormData] = useState({
      email: "",
      amount: "",
      invoiceType: "Inclusive",
      isPaid: false,
    });

    const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true)
      try {
        const response:any = await axios.post(
          "/api/admin/create_invoice",formData,
          {
            withCredentials: true,
          })
        if (response?.data) {
          toast.success(response?.data?.message)
          setShowCustomForm(false);
          setFormData({
            email: "",
            amount: "",
            invoiceType: "Inclusive",
            isPaid: false,
          });
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error creating invoice");
      }finally{
        setLoading(false)
      }
    };

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Create Custom Invoice</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceType">Invoice Type</Label>
              <Select
                value={formData.invoiceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, invoiceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inclusive">Inclusive</SelectItem>
                  <SelectItem
                    value="Exclusive"
                  >
                    Exclusive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isPaid">Payment Status</Label>
              <Switch
                id="isPaid"
                checked={formData.isPaid}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPaid: checked })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              Create Invoice
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h1 className="text-3xl font-bold mb-6">Invoice Management</h1>
        {showCustomForm ? (
          <CustomInvoiceForm onBack={() => setShowCustomForm(false)} />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>NetCoin Purchase History</CardTitle>
                <Button
                  variant="default"
                  onClick={() => setShowCustomForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Custom Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>User</TableHead>
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
                        {invoice?.paymentMethod !== "Cryptomous"
                          ? invoice?.invoiceId
                          : "No Invoice For Crypto"}
                      </TableCell>
                      <TableCell>{invoice?.user?.email}</TableCell>
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
        )}
      </div>
    </main>
  );
};

export default AdminInvoices;
