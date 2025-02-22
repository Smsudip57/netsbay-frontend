import { FileText, Download } from "lucide-react";
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

const Invoices = () => {
  // Sample invoice data for NetCoin purchases
  const invoices = [
    {
      id: "INV-001",
      date: "2024-02-20",
      netcoins: 200,
      subtotal: 200.00,
      gst: 36.00, // 18% GST
      total: 236.00,
      status: "Paid",
    },
    {
      id: "INV-002",
      date: "2024-02-15",
      netcoins: 500,
      subtotal: 500.00,
      gst: 90.00, // 18% GST
      total: 590.00,
      status: "Paid",
    },
  ];

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
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.netcoins} NC</TableCell>
                    <TableCell>₹{invoice.subtotal.toFixed(2)}</TableCell>
                    <TableCell>₹{invoice.gst.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">₹{invoice.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
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