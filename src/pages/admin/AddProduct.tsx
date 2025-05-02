import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    ipSet: "",
    networkType: "",
    cpu: "",
    ram: "",
    storage: "",
    inStock: true,
    os: "",
    price: "",
    maxPendingService: 0
  });
  const [ipsets, setIpsets] = useState<string[]>([]);
  const [osTypes, setOsTypes] = useState<string[]>([]);
   const [datacenters, setDatacenters] = useState<any>([]);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.productName ||
      !formData.ipSet ||
      !formData.networkType ||
      !formData.cpu ||
      !formData.ram ||
      !formData.storage ||
      !formData.os ||
      !formData.price
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      const res = await axios.post("/api/admin/add_product", formData, {
        withCredentials: true,
      });
      if (res?.data?.success) {
        toast.success("Product added successfully");
        navigate("/admin/products");
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  useEffect(() => {
    const generateProductId = async () => {
      try {
        const res = await axios.get("/api/admin/generate_id", {
          withCredentials: true,
        });
        setFormData((prev) => ({
          ...prev,
          productId: res?.data?.id,
        }));
      } catch (error) {
        console.error("Error generating product ID:", error);
      }
    };
    generateProductId();
  }, []);

  useEffect(() => {
    const fetchIpsets = async () => {
      try {
        const res = await axios.get("/api/admin/system", {
          params: { name: "ipSets" },
          withCredentials: true,
        });
        const osres = await axios.get("/api/admin/system", {
          params: { name: "osType" },
          withCredentials: true,
        });
        const datacenter = await axios.get("/api/admin/system", {
          params: { name: "datacenter" },
          withCredentials: true,
        });
        setOsTypes(osres?.data);
        setIpsets(res?.data);
        setDatacenters(datacenter?.data);
      } catch (error) {
        console.error("Error fetching ipsets:", error);
      }
    };
    fetchIpsets();
  }, []);


  return (
    <div className="p-6 flex-1 bg-background">
      <div className="glass-card rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <Button variant="outline" onClick={() => navigate("/admin/products")}>
            Back to Products
          </Button>
        </div>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={formData.productId}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) =>
                      handleInputChange("productName", e.target.value)
                    }
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipSet">IP Set</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("ipSet", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={ipsets?.length > 0 ? "Select IP Set" : "No IP Sets Found"} />
                    </SelectTrigger>
                    <SelectContent>
                      {ipsets?.length > 0 && ipsets?.map((ipset: any, index) => (
                        <SelectItem key={index} value={ipset?.value}>
                          {ipset?.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="networkType">VM Type</Label>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange("networkType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Network Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Internal RDP",
                        "External RDP",
                        "Internal Linux",
                        "External Linux",
                      ].map((networkType, index) => (
                        <SelectItem key={index} value={networkType}>
                          {networkType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU Cores</Label>
                  <Input
                    id="cpu"
                    type="number"
                    value={formData.cpu}
                    onChange={(e) => handleInputChange("cpu", e.target.value)}
                    placeholder="e.g., 2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM (GB)</Label>
                  <Input
                    id="ram"
                    type="number"
                    value={formData.ram}
                    onChange={(e) => handleInputChange("ram", e.target.value)}
                    placeholder="e.g., 4"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage (GB)</Label>
                  <Input
                    id="storage"
                    type="number"
                    value={formData.storage}
                    onChange={(e) =>
                      handleInputChange("storage", e.target.value)
                    }
                    placeholder="e.g., 20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("os", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={osTypes?.length > 0 ? "Select OS" : "No Os Found"} />
                    </SelectTrigger>
                    <SelectContent>
                      {osTypes?.length > 0 && osTypes?.map((os: any, index) => (
                        <SelectItem key={index} value={os?.value}>
                          {os?.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxPendingService">Maximum Pending Service</Label>
                  <Input
                    id="maxPendingService"
                    type="number"
                    value={formData.maxPendingService}
                    onChange={(e) => {
                      const value = Number(e.target.value); // Convert to number
                      if (value < 0) {
                        handleInputChange("maxPendingService", 0);
                      } else if (!Number.isInteger(value)) {
                        handleInputChange("maxPendingService", Math.floor(value));
                      } else {
                        handleInputChange("maxPendingService", value);
                      }
                    }}
                    placeholder="e.g., 5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (NC)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="e.g., 100 NC"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="os"> Datacenter</Label>
                  <Select
                    onValueChange={(value) => handleInputChange("datacenter", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={osTypes?.length > 0 ? "Select DataCenter" : "No DataCenter Found"} />
                    </SelectTrigger>
                    <SelectContent>
                      {datacenters?.length > 0 && datacenters?.map((os: any, index) => (
                        <SelectItem key={index} value={os?.value}>
                          {os?.value?.location} | {os?.value?.datastore} ( {os?.value?.status ? "Active" : "Inactive"} )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stock Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.inStock}
                      onCheckedChange={(checked) =>
                        handleInputChange("inStock", checked)
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.inStock
                        ? "Product is in stock"
                        : "Product is out of stock"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Product</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
