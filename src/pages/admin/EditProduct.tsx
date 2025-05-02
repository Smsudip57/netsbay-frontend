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
import axios from "axios";
import { set } from "date-fns";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    ipSet: "",
    serviceType: "",
    cpu: "",
    ram: "",
    storage: "",
    Stock: true,
    Os: "",
    price: "",
    maxPendingService: 0,
    datacenter: {},
  });
  const [ips, setIpsets] = useState<any>([]);
  const [osTypes, setOsTypes] = useState<any>([]);
  const [datacenters, setDatacenters] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/user/get_product`, {
          params: { productId: id },
          withCredentials: true,
        });
        if (res?.data) {
          setFormData(res?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);


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


  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
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
      !formData.serviceType ||
      !formData.cpu ||
      !formData.ram ||
      !formData.storage ||
      !formData.Os ||
      !formData.price
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("/api/admin/update_product", formData, {
        withCredentials: true,
      });
      if (res?.data) {
        toast.success("Product updated successfully");
        navigate("/admin/products");
      }
    } catch (error) {
      toast.error("Failed to update product");
    }
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
                      {ips?.length > 0 &&
                        ips?.map((ip: any, index: number) => (
                          <SelectItem key={index} value={ip?.value}>
                            {ip?.value}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceType">Network Type</Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      handleInputChange("serviceType", value)
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
                      ].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
                    onChange={(e) =>
                      handleInputChange("storage", e.target.value)
                    }
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
                  <Label htmlFor="maxPendingService">
                    Maximum Pending Service
                  </Label>
                  <Input
                    id="maxPendingService"
                    type="number"
                    value={formData.maxPendingService}
                    onChange={(e) => {
                      const value = Number(e.target.value); // Convert to number
                      if (value < 0) {
                        handleInputChange("maxPendingService", 0);
                      } else if (!Number.isInteger(value)) {
                        handleInputChange(
                          "maxPendingService",
                          Math.floor(value)
                        );
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
  <Label htmlFor="datacenter">Datacenter</Label>
  <Select
    value={formData.datacenter || ""}
    onValueChange={(value) => handleInputChange("datacenter", value)}
  >
    <SelectTrigger>
      <SelectValue placeholder={datacenters?.length > 0 ? "Select DataCenter" : "No DataCenter Found"} />
    </SelectTrigger>
    <SelectContent>
      {datacenters?.length > 0 && datacenters?.map((dc: any, index) => (
        <SelectItem key={index} value={dc._id}>
          {dc.value.location} | {dc.value.datastore} ({dc.value.status ? "Active" : "Inactive"})
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

                <div className="space-y-2">
                  <Label>Stock Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.Stock}
                      onCheckedChange={(checked) =>
                        handleInputChange("Stock", checked)
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      {formData.Stock
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
