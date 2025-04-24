import { ArrowLeft, Download } from "lucide-react";
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
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { PageSEO } from "@/components/PageSeo";
import { useAppContext } from "@/context/context";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const UserInvoices = () => {
  const { id } = useParams();
  const location = useLocation();
  const { userData, invoices = [] } = location.state || {};
  const { generatePDF } = useAppContext();
  
  const [currentInvoicePage, setCurrentInvoicePage] = useState(1);
  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);

  // Calculate pagination for invoices
  const totalInvoicePages = Math.max(1, Math.ceil(invoices.length / ITEMS_PER_PAGE));
  const startInvoiceIndex = (currentInvoicePage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = invoices.slice(startInvoiceIndex, startInvoiceIndex + ITEMS_PER_PAGE);

  // Calculate pagination for transactions
  const [transactions, setTransactions] = useState([]);
  const totalTransactionPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE));
  const startTransactionIndex = (currentTransactionPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = transactions.slice(startTransactionIndex, startTransactionIndex + ITEMS_PER_PAGE);

  // Format date properly
  const getDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };



  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response  = await axios.get(`/api/admin/get_user_transation`, {
          withCredentials: true,
          params: { userId: id },
        })
        if(response?.data) {
          setTransactions(response?.data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchTransactions();
  }, []);




  // Reset pages when tab changes
  const handleTabChange = (value) => {
    if (value === "invoices") setCurrentInvoicePage(1);
    if (value === "transactions") setCurrentTransactionPage(1);
  };

  return (
    <>
      <PageSEO
        title={`${userData?.firstName || 'User'}'s History`}
        description={`View invoice and transaction history for ${userData?.firstName} ${userData?.lastName}`}
      />
      
      <main className="p-6 flex-1">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 space-y-6">
          <div className="mb-6">
            <Link to={`/admin/users/${id}`}>
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to User Details
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">
              {userData?.firstName} {userData?.lastName}'s History
            </h1>
            <p className="text-muted-foreground">{userData?.email}</p>
          </div>

          <Tabs defaultValue="invoices" className="space-y-4" onValueChange={handleTabChange}>
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
                  {paginatedInvoices.length > 0 ? (
                    <>
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
                          {paginatedInvoices.map((invoice) => (
                            <TableRow key={invoice._id || invoice.invoiceId}>
                              <TableCell className="font-medium">
                                {invoice.paymentType !== "Cryptomous"
                                  ? invoice.invoiceId
                                  : "No Invoice For Crypto"}
                              </TableCell>
                              <TableCell>{getDate(invoice.createdAt)}</TableCell>
                              <TableCell>{invoice.coinAmout} NC</TableCell>
                              <TableCell>
                                {invoice.paymentType !== "Cryptomous" ? "₹" : "$"}
                                {invoice.paymentType !== "Cryptomous"
                                  ? (invoice.Price / 1.18)?.toFixed(2)
                                  : invoice.Price}
                              </TableCell>
                              <TableCell>
                                {invoice.paymentType !== "Cryptomous" ? "₹" : ""}
                                {invoice.paymentType !== "Cryptomous"
                                  ? (invoice.Price - invoice.Price / 1.18)?.toFixed(2)
                                  : "none"}
                              </TableCell>
                              <TableCell className="font-medium">
                                {invoice.paymentType !== "Cryptomous" ? "₹" : "$"}
                                {invoice.Price}
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  invoice.status === "Pending"
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {invoice.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                {invoice.paymentType !== "Cryptomous" && invoice.status === "Success" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => generatePDF(invoice)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    
                      <div className="mt-4 flex justify-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentInvoicePage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentInvoicePage === 1}
                          >
                            Previous
                          </Button>
                          <Button variant="outline" disabled>
                            Page {currentInvoicePage} of {totalInvoicePages}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setCurrentInvoicePage((prev) => Math.min(prev + 1, totalInvoicePages))}
                            disabled={currentInvoicePage === totalInvoicePages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No invoices found for this user
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>All Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {paginatedTransactions.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount (NC)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedTransactions.map((transaction) => (
                            <TableRow key={transaction._id || transaction.transactionId}>
                              <TableCell className="font-medium">
                                {transaction.transactionId}
                              </TableCell>
                              <TableCell>{getDate(transaction.createdAt)}</TableCell>
                              <TableCell>
                                <span className="px-2 py-1 rounded-full text-xs ">
                                  {transaction.type}
                                </span>
                              </TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell className={`text-right ${
                                transaction.amount > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}>
                                {transaction.amount > 0 ? "+" : ""}
                                {transaction.amount} NC
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    
                      <div className="mt-4 flex justify-center">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentTransactionPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentTransactionPage === 1}
                          >
                            Previous
                          </Button>
                          <Button variant="outline" disabled>
                            Page {currentTransactionPage} of {totalTransactionPages}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setCurrentTransactionPage((prev) => Math.min(prev + 1, totalTransactionPages))}
                            disabled={currentTransactionPage === totalTransactionPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-gray-500">
                      No transactions found for this user
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default UserInvoices;