import { useEffect, useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
  productType: z.string(),
  ipSet: z.string(),
  cpu: z.number(),
  ram: z.number(),
  storage: z.number(),
  os: z.string(),
  vmId: z.string().optional(),
  purchaseDate: z.string().optional(),
  purchaseProvider: z.string().optional(),
  hashCode: z.string().optional(),
  ipAddress: z.string(),
  username: z.string(),
  password: z.string(),
  bulkData: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ServiceType =
  | "Internal RDP"
  | "External RDP"
  | "Internal Linux"
  | "External Linux";

interface Product {
  productId: string;
  productName?: string;
  Os: string;
  serviceType: ServiceType;
  cpu: number;
  ram: number;
  storage: number;
  ipSet: string;
  price: number;
  Stock?: boolean;
  createdAt?: Date;
}

// const products = [
//   {
//     id: "ubuntu-internal",
//     name: "Ubuntu Server (Internal)",
//     type: "internal",
//     os: "Linux",
//     ipSet: "103.211",
//     cpu: 2,
//     ram: 2,
//     storage: 10,
//   },
//   {
//     id: "centos-internal",
//     name: "CentOS Server (Internal)",
//     type: "internal",
//     os: "Linux",
//     ipSet: "103.211",
//     cpu: 4,
//     ram: 4,
//     storage: 20,
//   },
//   {
//     id: "ubuntu-external",
//     name: "Ubuntu Server (External)",
//     type: "external",
//     os: "Linux",
//     ipSet: "103.157",
//     cpu: 4,
//     ram: 8,
//     storage: 30,
//   },
//   {
//     id: "centos-external",
//     name: "CentOS Server (External)",
//     type: "external",
//     os: "Linux",
//     ipSet: "103.157",
//     cpu: 8,
//     ram: 16,
//     storage: 50,
//   },
//   {
//     id: "windows-internal",
//     name: "Windows Server (Internal)",
//     type: "internal",
//     os: "Windows",
//     ipSet: "103.211",
//     cpu: 4,
//     ram: 8,
//     storage: 50,
//   },
//   {
//     id: "windows-external",
//     name: "Windows Server (External)",
//     type: "external",
//     os: "Windows",
//     ipSet: "103.157",
//     cpu: 8,
//     ram: 16,
//     storage: 100,
//   },
// ];

const providers = [
  { id: "aws", name: "Amazon Web Services (AWS)" },
  { id: "gcp", name: "Google Cloud Platform (GCP)" },
  { id: "azure", name: "Microsoft Azure" },
  { id: "digitalocean", name: "DigitalOcean" },
  { id: "linode", name: "Linode" },
  { id: "vultr", name: "Vultr" },
  { id: "other", name: "Other Provider" },
];

export function ServiceForm() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [verifiedData, setVerifiedData] = useState<
    Array<{
      ip: string;
      username: string;
      password: string;
      vmId?: string;
      hashCode?: string;
    }>
  >([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productType: "",
      ipSet: "",
      cpu: 0,
      ram: 0,
      storage: 0,
      os: "",
      ipAddress: "",
      username: "",
      password: "",
      bulkData: "",
      purchaseDate: "",
      purchaseProvider: "",
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/user/all_plans", {
          withCredentials: true,
        });
        setProducts(response?.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const onSubmit = async(data: FormValues) => {
    let reqData = []
    if (isBulkMode && data.bulkData) {
      const lines = data.bulkData.split("\n").filter((line) => line.trim());
      lines.forEach((line) => {
        const [ip, username, password, ...rest] = line.split(":");
        const serviceData = {
          ...data,
          ipAddress: ip,
          username,
          password,
        };

        if (selectedProduct.serviceType.includes("Internal")) {
          serviceData.vmId = rest[0];
        } else if (
          selectedProduct.serviceType.includes("External") &&
          selectedProduct.serviceType.includes("Linux")
        ) {
          serviceData.hashCode = rest[0];
        }

        reqData.push(serviceData);
      });
    } else {
      reqData.push(data);
    }
    try {
      const res = await axios.post("/api/admin/add_services", reqData, {
        withCredentials: true,
      })
      if(res?.data){
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error("Failed to add service.");
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.productId === productId);
    if (product) {
      setSelectedProduct(product);
      form.setValue("ipSet", product.ipSet);
      form.setValue("cpu", product.cpu);
      form.setValue("ram", product.ram);
      form.setValue("storage", product.storage);
      form.setValue("os", product.Os);
    }
  };

  const verifyBulkData = () => {
    const bulkData = form.getValues("bulkData");
    if (!bulkData || !selectedProduct) {
      toast.error("Please enter bulk data and select a product type first");
      return;
    }

    const lines = bulkData.split("\n").filter((line) => line.trim());
    const parsedData: typeof verifiedData = [];
    let hasErrors = false;

    lines.forEach((line, index) => {
      const parts = line.split(":");
      const isValid = selectedProduct.serviceType.includes("Internal")
        ? parts.length === 4
        : selectedProduct.serviceType.includes("External") &&
          selectedProduct.serviceType.includes("Linux")
        ? parts.length === 4
        : parts.length === 3;

      if (!isValid) {
        toast.error(`Line ${index + 1}: Invalid format`);
        hasErrors = true;
        return;
      }

      const [ip, username, password, extra] = parts;
      if (!ip || !username || !password) {
        toast.error(`Line ${index + 1}: Missing required fields`);
        hasErrors = true;
        return;
      }

      const entry: (typeof verifiedData)[0] = {
        ip: ip.trim(),
        username: username.trim(),
        password: password.trim(),
      };

      if (selectedProduct.serviceType.includes("Internal")) {
        entry.vmId = extra?.trim();
      } else if (
        selectedProduct.serviceType.includes("External") &&
        selectedProduct.serviceType.includes("Linux")
      ) {
        entry.hashCode = extra?.trim();
      }

      parsedData.push(entry);
    });

    if (!hasErrors) {
      setVerifiedData(parsedData);
      toast.success("Data verified successfully");
    } else {
      setVerifiedData([]);
    }
  };

  const getBulkFormatExample = () => {
    if (!selectedProduct) return "";

    if (selectedProduct.serviceType.includes("Internal")) {
      return "IP:Username:Password:VMID\nExample:\n192.168.1.1:admin:pass123:VM001";
    } else if (
      selectedProduct.serviceType.includes("External") &&
      selectedProduct.serviceType.includes("Linux")
    ) {
      return "IP:Username:Password:HashCode\nExample:\n192.168.1.1:admin:pass123:hash123";
    } else {
      return "IP:Username:Password\nExample:\n192.168.1.1:admin:pass123";
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            checked={isBulkMode}
            onCheckedChange={setIsBulkMode}
            id="bulk-mode"
          />
          <label htmlFor="bulk-mode" className="text-sm font-medium">
            Bulk Add Services
          </label>
        </div>

        <FormField
          control={form.control}
          name="productType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleProductSelect(value);
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={product?.productId}
                      value={product?.productId}
                    >
                      {product?.Os} - {product?.serviceType} ({product.ipSet})
                      {" | "}
                      {product.cpu} CPU, {product.ram}GB RAM
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedProduct && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ipSet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Set</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPU Cores</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM (GB)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage (GB)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedProduct.serviceType.includes("External") && isBulkMode && (
              <>
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchaseProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Provider</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {isBulkMode ? (
              <>
                <FormField
                  control={form.control}
                  name="bulkData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bulk Service Details</FormLabel>
                      <div className="space-y-2">
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder={getBulkFormatExample()}
                            className="min-h-[200px] font-mono"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={verifyBulkData}
                          className="w-full sm:w-auto"
                        >
                          Verify & Format Data
                        </Button>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          Enter one service per line in the format shown in the
                          placeholder.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {verifiedData.length > 0 && (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Password</TableHead>
                          {selectedProduct.serviceType.includes("Internal") && (
                            <TableHead>VM ID</TableHead>
                          )}
                          {selectedProduct.serviceType.includes("External") &&
                            selectedProduct.Os === "Linux" && (
                              <TableHead>Hash Code</TableHead>
                            )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {verifiedData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.ip}</TableCell>
                            <TableCell>{item.username}</TableCell>
                            <TableCell>{item.password}</TableCell>
                            {selectedProduct.serviceType.includes(
                              "Internal"
                            ) && <TableCell>{item.vmId}</TableCell>}
                            {selectedProduct.serviceType.includes("External") &&
                              selectedProduct.Os === "Linux" && (
                                <TableCell>{item.hashCode}</TableCell>
                              )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            ) : (
              <>
                {selectedProduct.serviceType.includes("Internal") && (
                  <FormField
                    control={form.control}
                    name="vmId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VM ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {selectedProduct.serviceType.includes("External") && (
                  <>
                    <FormField
                      control={form.control}
                      name="purchaseDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purchaseProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Provider</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {providers.map((provider) => (
                                <SelectItem
                                  key={provider.id}
                                  value={provider.id}
                                >
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedProduct.serviceType.includes("Linux") && (
                      <FormField
                        control={form.control}
                        name="hashCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hash Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="ipAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IP Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </>
        )}

        <Button type="submit">
          {isBulkMode ? "Add Services" : "Add Service"}
        </Button>
      </form>
    </Form>
  );
}
