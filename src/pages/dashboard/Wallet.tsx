import { WalletIcon, ArrowRight, Gift, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/context";

const Wallet = () => {
  const navigate = useNavigate();
  const [redeemCode, setRedeemCode] = useState("");
  const { user } = useAppContext();

  const handleRedeem = () => {
    if (!redeemCode.trim()) {
      toast.error("Please enter a redeem code");
      return;
    }
    toast.success("Redeem code submitted successfully!");
    setRedeemCode("");
  };

  // Transactions where real money was used to purchase NetCoins
  const recentTransactions = [
    { 
      id: 1, 
      type: 'purchase', 
      amount: '200.00 NC', 
      price: '₹200.00',
      description: 'NetCoin Purchase', 
      date: '2024-03-20', 
      method: 'UPI',
      invoiceId: 'INV-001',
      hasInvoice: true 
    },
    { 
      id: 2, 
      type: 'redeem', 
      amount: '50.00 NC', 
      price: 'N/A',
      description: 'Redeem Code: WELCOME50', 
      date: '2024-03-18', 
      method: 'Code',
      invoiceId: null,
      hasInvoice: false 
    },
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-6">
          Wallet
        </h2>

        {/* Top Section: Balance and Redeem side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <WalletIcon className="h-5 w-5 text-purple-500" />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {user?.balance} NC
              </div>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl" 
                onClick={() => navigate('/dashboard/purchase-netcoins')}
              >
                Add Funds
              </Button>
            </CardContent>
          </Card>

          {/* Redeem Card */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Gift className="h-5 w-5 text-emerald-500" />
                Redeem Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="Enter redeem code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="bg-white/50 dark:bg-gray-900/50 border-gray-200/50"
                />
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={handleRedeem}
                >
                  Redeem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/50 dark:bg-gray-900/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Transactions</CardTitle>
              <Button 
                onClick={() => navigate('/dashboard/invoices')} 
                variant="outline"
                className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                View All Invoices
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="flex justify-between items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-gray-100 dark:border-gray-800"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} • {transaction.method}
                        {transaction.invoiceId && ` • Invoice ${transaction.invoiceId}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium text-green-600 dark:text-green-400">
                          {transaction.amount}
                        </div>
                        {transaction.price !== 'N/A' && (
                          <div className="text-sm text-muted-foreground">
                            {transaction.price}
                          </div>
                        )}
                      </div>
                      {transaction.hasInvoice && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => navigate(`/dashboard/invoices?id=${transaction.invoiceId}`)}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download Invoice</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Wallet;