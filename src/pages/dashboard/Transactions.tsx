import { DollarSign, ArrowUpDown, Server, Shield, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { get } from "http";


const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  // const transactions = [
  //   {
  //     id: "TRX-001",
  //     date: "2024-02-20",
  //     description: "Basic VPS Server Purchase",
  //     type: "VPS",
  //     icon: <Server className="h-4 w-4" />,
  //     amount: 100,
  //   },
  //   {
  //     id: "TRX-002",
  //     date: "2024-02-19",
  //     description: "DDoS Protection Service",
  //     type: "Security",
  //     icon: <Shield className="h-4 w-4" />,
  //     amount: 50,
  //   },
  //   {
  //     id: "TRX-003",
  //     date: "2024-02-18",
  //     description: "CPU Upgrade Package",
  //     type: "Hardware",
  //     icon: <Cpu className="h-4 w-4" />,
  //     amount: 75,
  //   },
  // ];


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("/api/user/transactions", {
          withCredentials: true,
        });
        setTransactions(res?.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchTransactions();
  }, []);


  const getDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h2 className="text-3xl font-bold mb-6">Service Purchase Transactions</h2>

        <Card>
          <CardHeader>
            <CardTitle>Recent Service Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount (NC)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction?.transactionId}>
                    <TableCell className="font-medium">{transaction?.transactionId}</TableCell>
                    <TableCell>{getDate(transaction?.createdAt)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        {/* {transaction.icon} */}
                        {transaction?.type}
                      </span>
                    </TableCell>
                    <TableCell>{transaction?.description}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 font-medium">
                        {transaction?.amount} NC
                      </span>
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

export default Transactions;