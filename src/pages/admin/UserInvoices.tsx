
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserInvoices = () => {
  const { id } = useParams();
  const [currentInvoicePage, setCurrentInvoicePage] = useState(1);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);

  // Mock invoices data
  const invoices = [
    {
      id: "INV-001",
      date: "2024-03-10",
      amount: 100,
      status: "Paid",
      description: "Service Purchase",
      gst: 18,
      total: 118
    },
    {
      id: "INV-002",
      date: "2024-03-09",
      amount: 200,
      status: "Pending",
      description: "NetCoins Purchase",
      gst: 36,
      total: 236
    },
    // Add more mock invoices as needed
  ];

  // Mock transactions data
  const transactions = [
    {
      id: "TRX-001",
      date: "2024-03-10",
      type: "Service Purchase",
      description: "Ubuntu VPS Server",
      amount: -100,
      balance: 400
    },
    {
      id: "TRX-002",
      date: "2024-03-09",
      type: "NetCoins Added",
      description: "Admin Credit",
      amount: 200,
      balance: 500
    },
    // Add more mock transactions as needed
  ];

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 space-y-6">
        <div className="mb-6">
          <Link to={`/admin/users/${id}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to User Details
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">User History</h1>
        </div>

        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>All Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount (NC)</TableHead>
                      <TableHead>GST (18%)</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>{invoice.amount}</TableCell>
                        <TableCell>{invoice.gst}</TableCell>
                        <TableCell>{invoice.total}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            invoice.status === 'Paid' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentInvoicePage(prev => Math.max(prev - 1, 1))}
                      disabled={currentInvoicePage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled
                    >
                      Page {currentInvoicePage}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentInvoicePage(prev => prev + 1)}
                      disabled={invoices.length < 10}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount (NC)</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </TableCell>
                        <TableCell>{transaction.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTransactionPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentTransactionPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      disabled
                    >
                      Page {currentTransactionPage}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTransactionPage(prev => prev + 1)}
                      disabled={transactions.length < 10}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default UserInvoices;
