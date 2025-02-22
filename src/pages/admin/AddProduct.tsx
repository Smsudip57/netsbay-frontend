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

const generateProductId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `PRD${randomNum}`;
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productId: generateProductId(),
    productName: "",
    ipSet: "",
    networkType: "",
    cpu: "",
    ram: "",
    storage: "",
    inStock: true,
    os: "",
    price: "", // Price in NC
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.ipSet || !formData.networkType || 
        !formData.cpu || !formData.ram || !formData.storage || !formData.os || !formData.price) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log("Saving product:", formData);
    toast.success("Product added successfully");
    navigate("/admin/products");
  };

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
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipSet">IP Set</Label>
                  <Select onValueChange={(value) => handleInputChange("ipSet", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select IP Set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="103.211">103.211</SelectItem>
                      <SelectItem value="103.157">103.157</SelectItem>
                      <SelectItem value="157.15">157.15</SelectItem>
                      <SelectItem value="38.3">38.3</SelectItem>
                      <SelectItem value="161.248">161.248</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="networkType">Network Type</Label>
                  <Select onValueChange={(value) => handleInputChange("networkType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Network Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
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
                    onChange={(e) => handleInputChange("storage", e.target.value)}
                    placeholder="e.g., 20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Select onValueChange={(value) => handleInputChange("os", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Linux-Ubuntu">Linux-Ubuntu</SelectItem>
                      <SelectItem value="Linux-CentOS">Linux-CentOS</SelectItem>
                      <SelectItem value="Windows">Windows</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label>Stock Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.inStock}
                      onCheckedChange={(checked) => handleInputChange("inStock", checked)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.inStock ? "Product is in stock" : "Product is out of stock"}
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
