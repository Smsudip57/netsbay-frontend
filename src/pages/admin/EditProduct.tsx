import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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
    price: "", // Price in NC
  });

  useEffect(() => {
    // Here you would typically fetch the product data using the ID
    console.log("Fetching product with ID:", id);
    // Simulated data fetch
    setFormData({
      productId: "PRD61234",
      productName: "Sample Product",
      ipSet: "103.211",
      networkType: "internal",
      cpu: "2",
      ram: "4",
      storage: "20",
      inStock: true,
      os: "Linux-Ubuntu",
      price: "29.99", // Sample price
    });
  }, [id]);

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

    console.log("Updating product:", formData);
    toast.success("Product updated successfully");
    navigate("/admin/products");
  };

  return (
    <div className="p-6 flex-1 bg-background">
      <div className="glass-card rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Product</h1>
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ipSet">IP Set</Label>
                  <Select 
                    value={formData.ipSet}
                    onValueChange={(value) => handleInputChange("ipSet", value)}
                  >
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
                  <Select 
                    value={formData.networkType}
                    onValueChange={(value) => handleInputChange("networkType", value)}
                  >
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ram">RAM (GB)</Label>
                  <Input
                    id="ram"
                    type="number"
                    value={formData.ram}
                    onChange={(e) => handleInputChange("ram", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Storage (GB)</Label>
                  <Input
                    id="storage"
                    type="number"
                    value={formData.storage}
                    onChange={(e) => handleInputChange("storage", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Select 
                    value={formData.os}
                    onValueChange={(value) => handleInputChange("os", value)}
                  >
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
                <Button type="submit">Update Product</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProduct;
