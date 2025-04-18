
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
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, ArrowLeft, ChevronsUpDown, User, Loader2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AddCoupon = () => {
  const navigate = useNavigate();
  const [addToProhibition, setAddToProhibition] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [prohibitedUsers, setProhibitedUsers] = useState<string[]>([]);
  // const [productInput, setProductInput] = useState("");
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

  const handleAddUser = (userInput) => {
    if (userInput && !selectedUsers.includes(userInput)) {
      setSelectedUsers([...selectedUsers, userInput]);
    }
  };

  const handleAddProduct = (productInput) => {
    if (productInput && !selectedProducts.includes(productInput)) {
      setSelectedProducts([...selectedProducts, productInput]);
      // setProductInput("");
    }
  };

  const handleAddProhibitedUser = (prohibitedUserInput) => {
    if (prohibitedUserInput && !prohibitedUsers.includes(prohibitedUserInput)) {
      setProhibitedUsers([...prohibitedUsers, prohibitedUserInput]);
      // setProhibitedUserInput("");
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
        masterType: "product",
        label: label,
        user: selectedUsers,
        userProhibited: prohibitedUsers,
        addUsersToProhibited: addToProhibition,
        productId: selectedProducts,
        discountAmmount: discountAmmount,
        discountParcent: discountParcent,
        maxUses: useCount,
        endDate: expiryDate,
        token: couponToken,
      }, { withCredentials: true });
      if (response?.data) {
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
                  <UserEmailSearch
                    value={selectedUsers}
                    onChange={(user) => { handleAddUser(user?.email)}}
                  // placeholder="Enter user Email"
                  />
                  {/* <Button type="button" onClick={handleAddUser}>
                    Add
                  </Button> */}
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
                <Label>Product Ids (Empty for all products)</Label>
                <div className="flex gap-2 mb-2">
                  <UserProductSearch
                    value={selectedProducts}
                    onChange={(product) => handleAddProduct(product?.productId)}
                    // placeholder="Enter product ID"
                  />
                  {/* <Button type="button" onClick={handleAddProduct}>
                    Add
                  </Button> */}
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
                <UserEmailSearch
                  value={prohibitedUsers}
                  onChange={(user) => handleAddProhibitedUser(user?.email)}
                  // placeholder="Enter user Email to prohibit"
                />
                {/* <Button type="button" onClick={handleAddProhibitedUser}>
                  Add
                </Button> */}
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



const UserEmailSearch = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const wrapperRef = useRef(null);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setInputValue(query);

    if (query.trim()) {
      setOpen(true);
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/search_user_by_email', {
          params: { email: query },
          withCredentials: true
        });

        if (response.data) {
          setSearchResults(response.data);
          if (response.data.length > 0) {
            setOpen(true);
          }
        }
      } catch (error) {
        console.error('Error searching users:', error);
        toast.error('Failed to search users');
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    onChange(user);
    setInputValue("")
    setOpen(false);
  };

  return (
    <div className="w-full rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer ">


      {/* Direct approach without Popover */}
      <div ref={wrapperRef} className="relative">
        <div className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search user email..."
            className="w-full bg-transparent outline-none"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => inputValue.trim() && setOpen(true)}
          />
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </div>

        {/* Dropdown menu */}
        {open && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full rounded-md border border-input bg-background shadow-md mt-1 overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto p-1">
              {loading ? (
                <div className="py-6 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer ${selectedUser?.email === user.email ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                        }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(user.email) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col w-full group">
                        <span>{user.email}</span>
                        <span className="text-xs text-muted-foreground max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-200">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  {inputValue ? "No users found" : "Type to search users"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const UserProductSearch = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const searchTimeout = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const wrapperRef = useRef(null);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (query) => {
    setInputValue(query);

    if (query.trim()) {
      setOpen(true);
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/search_productid', {
          params: { id: query },
          withCredentials: true
        });

        if (response.data) {
          setSearchResults(response.data);
          if (response.data.length > 0) {
            setOpen(true);
          }
        }
      } catch (error) {
        console.error('Error searching users:', error);
        toast.error('Failed to search users');
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    onChange(user);
    setInputValue("")
    setOpen(false);
  };

  return (
    <div className="w-full rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer ">


      {/* Direct approach without Popover */}
      <div ref={wrapperRef} className="relative">
        <div className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search user productid..."
            className="w-full bg-transparent outline-none"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => inputValue.trim() && setOpen(true)}
          />
          <div
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          >
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </div>

        {/* Dropdown menu */}
        {open && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full rounded-md border border-input bg-background shadow-md mt-1 overflow-hidden"
          >
            <div className="max-h-[300px] overflow-y-auto p-1">
              {loading ? (
                <div className="py-6 text-center">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className={`flex items-center px-2 py-1.5 text-sm rounded-sm cursor-pointer`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value.includes(user?.productId) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col w-full group">
                        <span>{user?.productName} • {user?.cpu}C / {user?.ram}GB / {user?.storage}GB</span>
                        <span className="text-xs text-muted-foreground max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-200">
                          {user?.productId}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center text-sm text-muted-foreground">
                  {inputValue ? "No users found" : "Type to search users"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
