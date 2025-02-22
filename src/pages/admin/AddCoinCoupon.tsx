
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AddCoinCoupon = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [couponToken, setCouponToken] = useState("");
  const [amount, setAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const validateCouponToken = (token: string) => {
    const regex = /^[A-Z][A-Z0-9]{7,}$/;
    return regex.test(token);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCouponToken(couponToken)) {
      toast({
        variant: "destructive",
        title: "Invalid coupon token",
        description: "Token must start with a letter, contain only capital letters and numbers, and be at least 8 characters long.",
      });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid positive number for the amount.",
      });
      return;
    }

    if (usageLimit && (isNaN(Number(usageLimit)) || Number(usageLimit) <= 0)) {
      toast({
        variant: "destructive",
        title: "Invalid usage limit",
        description: "Usage limit must be a positive number.",
      });
      return;
    }

    // Handle form submission
    console.log({
      couponToken,
      amount: Number(amount),
      usageLimit: usageLimit ? Number(usageLimit) : "∞",
    });

    toast({
      title: "Coin Coupon Created",
      description: "The coin coupon has been successfully created.",
    });

    navigate("/admin/coupons");
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/coupons")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Add Coin Coupon</h1>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="couponToken">Coupon Token</Label>
              <Input
                id="couponToken"
                value={couponToken}
                onChange={(e) => setCouponToken(e.target.value.toUpperCase())}
                placeholder="e.g., COINSBONUS"
                className="uppercase"
              />
              <p className="text-sm text-muted-foreground">
                Must start with a letter, contain only capital letters and numbers, and be at least 8 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NC)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount of coins"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => navigate("/admin/coupons")}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Coupon
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default AddCoinCoupon;
