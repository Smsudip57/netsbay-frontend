
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const AddCoupon = () => {
  const navigate = useNavigate();
  const [addToProhibition, setAddToProhibition] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [prohibitedUsers, setProhibitedUsers] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [productInput, setProductInput] = useState("");
  const [prohibitedUserInput, setProhibitedUserInput] = useState("");
  const [couponToken, setCouponToken] = useState("");
  const [label, setLabel] = useState("");
  const [discountAmmount, setDiscountAmmount] = useState<number>(0);
  const [discountParcent, setDiscountParcent] = useState<number>(0);
  const [useCount, setUseCount] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState("");

  const validateCouponToken = (token: string) => {
    const regex = /^[A-Z][A-Z0-9]{7,}$/;
    return regex.test(token);
  };

  const handleAddUser = () => {
    if (userInput && !selectedUsers.includes(userInput)) {
      setSelectedUsers([...selectedUsers, userInput]);
      setUserInput("");
    }
  };

  const handleAddProduct = () => {
    if (productInput && !selectedProducts.includes(productInput)) {
      setSelectedProducts([...selectedProducts, productInput]);
      setProductInput("");
    }
  };

  const handleAddProhibitedUser = () => {
    if (prohibitedUserInput && !prohibitedUsers.includes(prohibitedUserInput)) {
      setProhibitedUsers([...prohibitedUsers, prohibitedUserInput]);
      setProhibitedUserInput("");
    }
  };

  const removeUser = (user: string) => {
    setSelectedUsers(selectedUsers.filter(u => u !== user));
  };

  const removeProduct = (product: string) => {
    setSelectedProducts(selectedProducts.filter(p => p !== product));
  };

  const removeProhibitedUser = (user: string) => {
    setProhibitedUsers(prohibitedUsers.filter(u => u !== user));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/admin/create_coupon", {
        masterType : "product",
        label : label,
        user: selectedUsers,
        userProhibited: prohibitedUsers,
        addUsersToProhibited: addToProhibition,
        productId: selectedProducts,
        discountAmmount: discountAmmount,
        discountParcent : discountParcent,
        maxUses: useCount,
        endDate: expiryDate,
        token: couponToken,
      }, {withCredentials: true});
      if(response?.data) {
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
          <h1 className="text-3xl font-bold">Add New Coupon</h1>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="couponToken">Coupon Token</Label>
                <Input
                  id="couponToken"
                  value={couponToken}
                  onChange={(e) => setCouponToken(e.target.value.toUpperCase())}
                  placeholder="e.g., SUMMER2024"
                  className="uppercase"
                />
                <p className="text-sm text-muted-foreground">
                  Must start with a letter, contain only capital letters and numbers, and be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Select value={label} onValueChange={setLabel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="festive">Festive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>User Emails (Empty for all users)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Enter user Email"
                  />
                  <Button type="button" onClick={handleAddUser}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <Badge key={user} variant="secondary" className="gap-1">
                      {user}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeUser(user)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Product Emails (Empty for all products)</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={productInput}
                    onChange={(e) => setProductInput(e.target.value)}
                    placeholder="Enter product ID"
                  />
                  <Button type="button" onClick={handleAddProduct}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProducts.map((product) => (
                    <Badge key={product} variant="secondary" className="gap-1">
                      {product}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeProduct(product)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountDeduct">Amount to Deduct (NC)</Label>
                <Input 
                  type="number" 
                  value={discountAmmount}
                  onChange={(e) => setDiscountAmmount(parseInt(e.target.value))}
                  id="amountDeduct" 
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="percentageDeduct">Percentage to Deduct</Label>
                <Input 
                  type="number" 
                  id="percentageDeduct" 
                  value={discountParcent}
                  onChange={(e) => setDiscountParcent(parseInt(e.target.value))}
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="useCount">Count of Use</Label>
                <Input 
                  type="number" 
                  id="useCount" 
                  value={useCount}
                  onChange={(e) => setUseCount(parseInt(e.target.value))}
                  placeholder="Leave empty for unlimited"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input 
                  type="date" 
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  id="expiryDate"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="prohibition"
                  checked={addToProhibition}
                  onCheckedChange={setAddToProhibition}
                />
                <Label htmlFor="prohibition" className="text-sm text-gray-600">
                  Add user to prohibition list after using coupon (one-time use per user)
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>User Prohibition List (Blocked Users)</Label>
              <div className="text-sm text-gray-600 mb-2">
                Users in this list will be blocked from using this coupon regardless of other settings
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  value={prohibitedUserInput}
                  onChange={(e) => setProhibitedUserInput(e.target.value)}
                  placeholder="Enter user Email to prohibit"
                />
                <Button type="button" onClick={handleAddProhibitedUser}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {prohibitedUsers.map((user) => (
                  <Badge key={user} variant="secondary" className="gap-1">
                    {user}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeProhibitedUser(user)}
                    />
                  </Badge>
                ))}
              </div>
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

export default AddCoupon;
