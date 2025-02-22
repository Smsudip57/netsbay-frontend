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

const Transactions = () => {
  // Sample transactions data for service purchases
  const transactions = [
    {
      id: "TRX-001",
      date: "2024-02-20",
      description: "Basic VPS Server Purchase",
      type: "VPS",
      icon: <Server className="h-4 w-4" />,
      amount: 100,
    },
    {
      id: "TRX-002",
      date: "2024-02-19",
      description: "DDoS Protection Service",
      type: "Security",
      icon: <Shield className="h-4 w-4" />,
      amount: 50,
    },
    {
      id: "TRX-003",
      date: "2024-02-18",
      description: "CPU Upgrade Package",
      type: "Hardware",
      icon: <Cpu className="h-4 w-4" />,
      amount: 75,
    },
  ];

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
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        {transaction.icon}
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 font-medium">
                        {transaction.amount} NC
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