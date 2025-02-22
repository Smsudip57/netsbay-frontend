
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Shield, Monitor, Network, WalletIcon, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface LocationState {
  service: {
    id: string;
    name: string;
    type: string;
    cpu: number;
    ram: number;
    storage: number;
    ipSet: string;
    price: number;
  };
}

const ProductPurchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { service } = (location.state as LocationState) || {
    service: null,
  };

  const [quantity, setQuantity] = useState("1");
  const [couponCode, setCouponCode] = useState("");

  if (!service) {
    return (
      <div className="p-6">
        <p>No product selected. Please go back and select a product.</p>
        <Button onClick={() => navigate("/dashboard/buy-service")} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const getIcon = () => {
    switch (service.type) {
      case "Linux-Ubuntu":
        return <Package className="h-5 w-5" />;
      case "Linux-CentOS":
        return <Shield className="h-5 w-5" />;
      case "Windows":
        return <Monitor className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const handlePurchase = () => {
    toast.success("Purchase initiated! Redirecting to payment...");
    // Here you would typically handle the purchase logic
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.info("Validating coupon code...");
      // Here you would typically validate the coupon code
    }
  };

  const totalPrice = Number(quantity) * service.price;

  return (
    <main className="p-6 flex-1">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/buy-service")}
            >
              Back
            </Button>
            <h2 className="text-3xl font-bold">Purchase Product</h2>
          </div>
          <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg">
            <WalletIcon className="h-4 w-4 text-primary" />
            <span className="font-medium">Balance: 250.00 NC</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Details Column */}
          <div className="space-y-6">
            {/* Product Info Card */}
            <div className="rounded-xl glass-card p-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {getIcon()}
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent dark:from-cyan-400 dark:to-cyan-200">
                    {service.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 bg-white/5 dark:bg-black/20 rounded-lg p-3 mb-4 w-full">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>IP Set: {service.ipSet}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 bg-white/5 dark:bg-black/20 rounded-lg p-3">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>OS: {service.type}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 dark:bg-black/20 rounded-lg p-3">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>CPU: {service.cpu} Cores</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 dark:bg-black/20 rounded-lg p-3">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>RAM: {service.ram} GB</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 dark:bg-black/20 rounded-lg p-3">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>Storage: {service.storage} GB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="rounded-xl glass-card p-6">
              <h3 className="text-xl font-semibold text-cyan-400 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Root Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  <span>Unlimited Bandwidth</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 bg-cyan-500/10 text-cyan-400 p-4 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm">Your data and transactions are secure and encrypted.</p>
              </div>
            </div>
          </div>

          {/* Purchase Form Column */}
          <div className="rounded-xl glass-card p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Select
                  value={quantity}
                  onValueChange={setQuantity}
                >
                  <SelectTrigger id="quantity" className="bg-white/5 dark:bg-black/20">
                    <SelectValue placeholder="Select quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="bg-white/5 dark:bg-black/20"
                  />
                  <Button 
                    onClick={handleApplyCoupon}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-gray-400">*No discount will actually be applied (demo).</p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-cyan-400">Order Summary</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Plan Price ({quantity} {Number(quantity) === 1 ? 'unit' : 'units'})</span>
                      <span>{totalPrice} NC</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>Discount</span>
                      <span>0 NC</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-cyan-400">{totalPrice} NC</span>
                  </div>

                  <Button 
                    onClick={handlePurchase} 
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductPurchase;
