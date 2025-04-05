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
import { useAppContext } from "@/context/context";

const Transactions = () => {
  const { transactions, setTransactions } = useAppContext();
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
                {transactions.map((transaction:any) => (
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
