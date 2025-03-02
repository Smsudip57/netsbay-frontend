import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Ban,
  Key,
  Plus,
  Minus,
  FileText,
  ExternalLink,
  CircleCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { act, useEffect, useState } from "react";
import { ServiceListView } from "@/components/dashboard/service/ServiceListView";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface Profile {
  name?: string;
  avatarUrl?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  whatsapp: string;
  address: Address;
  organizationName?: string;
  gstNumber?: string;
  role: "user" | "admin";
  createdAt: Date;
  balance: number;
  profile?: Profile;
  isActive: boolean;
  isBanned: boolean;
  revokedService: boolean;
  lastLogin: Date;
}

const UserDetails = () => {
  const { id } = useParams();
  const [netcoinsAmount, setNetcoinsAmount] = useState("");
  const [reason, setReason] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [gstType, setGstType] = useState("inclusive");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState<User | null>(null);

  // Mock services data
  const services = [
    {
      id: 1,
      name: "Ubuntu Server",
      type: "Linux-Ubuntu",
      status: "running",
      ip: "103.211.45.67",
      serviceId: "S42342342",
      expiryDate: "2024-12-31",
      specs: {
        cpu: "2 vCPU",
        ram: "2 GB",
        storage: "20 GB",
      },
    },
    // ... Add more mock services as needed
  ];

  // Mock recent invoices
  const recentInvoices = [
    {
      id: "INV-001",
      date: "2024-03-10",
      amount: 100,
      status: "Paid",
      description: "Service Purchase",
    },
    // ... Add more mock invoices
  ];

  useEffect(() => {
    const fetchUser = async () => {
      console.log(id);
      try {
        const response = await axios.get(`/api/admin/targetuser`, {
          params: { userId: id },
          withCredentials: true,
        });
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleUserAction = async (action: "ban" | "revoke") => {
    if (action === "ban") {
      try {
        const res = await axios.put(
          `/api/admin/update_user`,
          { userId: id, isBanned: !user?.isBanned },
          { withCredentials: true }
        );
        if (res?.data) {
          toast.success("User " + (user?.isBanned ? "unbanned" : "banned"));
          setUser(res?.data?.user);
        }
      } catch (error) {
        toast.error(`Failed to ${user?.isBanned ? "unban" : "ban"} user`);
      }
    } else if (action === "revoke") {
      try {
        const res = await axios.put(
          `/api/admin/update_user`,
          { userId: id, revokedService: !user?.revokedService },
          { withCredentials: true }
        );
        if (res?.data) {
          toast.success(
            "Service " + (user?.revokedService ? "unrevoked" : "revoked")
          );
          setUser(res?.data?.user);
        }
      } catch (error) {
        toast.error(
          `Failed to ${user?.revokedService ? "unrevoke" : "revoke"} service`
        );
      }
    }
  };

  const handleNetcoinsAction = async(action: "add" | "deduct") => {
    if (!netcoinsAmount || !reason) {
      toast.error("Please fill in all fields");
      return;
    }
    if (action === "add") {
      try {
        const res: any = await axios.put(
          `/api/admin/update_user`,
          {
            userId: id,
            balance: user?.balance + parseInt(netcoinsAmount),
            reason,
          },
          { withCredentials: true }
        );
        if (res?.data) {
          toast.success("Netcoins added successfully");
          setUser(res?.data?.user);
        }
      } catch (error) {
        toast.error("Failed to add netcoins");
      } finally {
        setNetcoinsAmount("");
        setReason("");
      }
    } else if (action === "deduct") {
      try {
        const res: any = await axios.put(
          `/api/admin/update_user`,
          {
            userId: id,
            balance: user?.balance - parseInt(netcoinsAmount),
            reason,
          },
          { withCredentials: true }
        );
        if (res?.data) {
          toast.success("Netcoins deducted successfully");
          setUser(res?.data?.user);
        }
      } catch (error) {
        toast.error("Failed to deduct netcoins");
      } finally {
        setNetcoinsAmount("");
        setReason("");
      }
    }
  };

  const handleGenerateInvoice = () => {
    if (!invoiceAmount || !transactionId) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Invoice generated successfully");
    setInvoiceAmount("");
    setTransactionId("");
  };

  const getDate = (date: Date) => {
    const dateObj = new Date(date);

    return dateObj.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 space-y-6">
        <div className="mb-6">
          <Link to="/admin/users">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>

        {/* User Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="mt-1">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="mt-1">{user?.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user?.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Join Date
                  </h3>
                  <p className="mt-1">{getDate(user?.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Login
                  </h3>
                  <p className="mt-1">{getDate(user?.lastLogin)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1">
                    {user?.address?.city}, {user?.address?.state},{" "}
                    {user?.address?.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{user?.whatsapp}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              variant={!user?.isBanned ? "destructive" : "default"}
              className={`${!user?.isBanned ? "" : "text-white"}`}
              onClick={() => handleUserAction("ban")}
            >
              {user?.isBanned ? (
                <CircleCheck className="h-4 w-4 mr-2" />
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              {user?.isBanned ? "Unban" : "Ban"} User
            </Button>
            <Button
              variant={!user?.revokedService ? "destructive" : "default"}
              className={`${!user?.revokedService ? "" : "text-white"}`}
              onClick={() => handleUserAction("revoke")}
            >
              {user?.revokedService ? (
                <CircleCheck className="h-4 w-4 mr-2" />
              ) : (
                <Key className="h-4 w-4 mr-2" />
              )}
              {user?.revokedService ? "Unrevoke" : "Revoke"} Service
            </Button>
          </CardContent>
        </Card>

        {/* Admin Coin Control Section */}
        <Card>
          <CardHeader>
            <CardTitle>NetCoin Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-2xl font-bold">{user?.balance} NC</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (NC)</Label>
                  <Input
                    id="amount"
                    value={netcoinsAmount}
                    onChange={(e) => setNetcoinsAmount(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleNetcoinsAction("add")}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add NetCoins
                </Button>
                <Button
                  onClick={() => handleNetcoinsAction("deduct")}
                  variant="destructive"
                  className="flex-1"
                >
                  <Minus className="h-4 w-4 mr-2" />
                  Deduct NetCoins
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Invoice Generation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Manual Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceAmount">Amount (NC)</Label>
                  <Input
                    id="invoiceAmount"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    type="number"
                  />
                </div>
                <div>
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gstType">GST Type</Label>
                  <Select value={gstType} onValueChange={setGstType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GST type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inclusive">GST Inclusive</SelectItem>
                      <SelectItem value="exclusive">GST Exclusive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGenerateInvoice}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Invoice
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Services Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Services</CardTitle>
          </CardHeader>
          <CardContent>
            <ServiceListView services={[]} />
            <div className="mt-4 flex justify-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button variant="outline" disabled>
                  Page {currentPage}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={services.length < 10}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Link to={`/admin/users/${id}/invoices`}>
              <Button variant="outline">
                View All
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.amount} NC</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UserDetails;
