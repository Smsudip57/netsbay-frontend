
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {toast} from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const AddCoinCoupon = () => {
  const navigate = useNavigate();
  const [couponToken, setCouponToken] = useState("");
  const [amount, setAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const validateCouponToken = (token: string) => {
    const regex = /^[A-Z][A-Z0-9]{7,}$/;
    return regex.test(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const Response = await axios.post("/api/admin/create_coupon", {
        masterType: "coin",
        coinAmmount: amount,
        maxUses: usageLimit,
        token: couponToken,
      }, {withCredentials: true});
      if(Response?.data) {
        toast.success("Coupon created successfully");
        navigate("/admin/coupons");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
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
