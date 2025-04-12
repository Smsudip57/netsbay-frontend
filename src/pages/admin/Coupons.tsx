import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Plus, MoreVertical, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import axios from "axios";

const Coupons = () => {
  const [productCoupons, setProductCoupons] = useState([]);
  const [coinCoupons, setCoinCoupons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/all_coupons", {
          withCredentials: true,
        });
        const productCoupons = res.data.filter(
          (coupon: any) => coupon.masterType === "product"
        );
        const coinCoupons = res.data.filter(
          (coupon: any) => coupon.masterType === "coin"
        );

        setProductCoupons(productCoupons);
        setCoinCoupons(coinCoupons);
      } catch (error) {console.log(error)}
    };

    fetchData();
  }, []);

  const getStatusColor = (data: any, val: boolean) => {
    let status = "expired";
    const date = new Date(data?.endDate);

    if (
      date > new Date() &&
      (data?.maxUses ? data?.used < data.maxUses : true)
    ) {
      status = "active";
    }
    if (!data?.isActive) {
      status = data.isActive ? "active" : "inactive";
    }
    if (data?.masterType === "coin") {
      status = data.isActive ? "active" : "inactive";
    }
    if (val) {
      return status;
    }

    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getDate = (date: Date) => {
    const dateObj = new Date(date);

    return dateObj.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDelete = async (_id: string, type: "product" | "coin") => {
    try {
      const res: any = await axios.delete(`/api/admin/delete_coupon`, {
        params: {
          couponId: _id,
        },
        withCredentials: true,
      });
      if (res?.data) {
        setProductCoupons((prev: any) =>
          prev.filter((coupon: any) => coupon._id !== _id)
        );
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error("Failed to delete coupon.");
    }
  };

  const handleStatus = async (value: boolean, couponId: string) => {
    try {
      const res = await axios.post(
        "/api/admin/coupon_status",
        {
          couponId: couponId,
          value: value,
        },
        {
          withCredentials: true,
        }
      );
      if (res?.data) {
        setProductCoupons((prev: any) =>
          prev.map((coupon: any) =>
            coupon._id === couponId ? { ...coupon, isActive: value } : coupon
          )
        );
        toast.success(res?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status.");
    }
  };

  const handleToggleStatus = (
    id: number,
    currentStatus: string,
    type: "product" | "coin"
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard");
  };

  return (
    <main className="p-6 flex-1 min-w-0">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 min-w-0">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold">Coupon Management</h1>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/admin/coupons/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Product Coupon
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/coupons/add-coin">
                <Plus className="mr-2 h-4 w-4" />
                Add Coin Coupon
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="product" className="space-y-4">
          <TabsList>
            <TabsTrigger value="product">Product Coupons</TabsTrigger>
            <TabsTrigger value="coin">Coin Coupons</TabsTrigger>
          </TabsList>

          <TabsContent value="product">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden p-1.5">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            Token
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Label
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Type
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Discount
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Usage Count
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Expiry Date
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Status
                          </TableHead>
                          <TableHead className="text-right whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productCoupons.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              No product coupons found. Create your first
                              coupon!
                            </TableCell>
                          </TableRow>
                        ) : (
                          productCoupons.map((coupon) => (
                            <TableRow key={coupon.id}>
                              <TableCell
                                className="font-medium whitespace-nowrap cursor-pointer hover:text-primary flex items-center gap-2"
                                onClick={() => handleCopyToken(coupon.token)}
                              >
                                {coupon.token}
                                <Copy className="h-3 w-3" />
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {coupon?.label
                                  ? coupon.label.charAt(0).toUpperCase() +
                                    coupon.label.slice(1).toLowerCase()
                                  : ""}
                              </TableCell>
                              <TableCell className="capitalize whitespace-nowrap">
                                {coupon.discountAmmount
                                  ? "Amount"
                                  : "Percentage"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {coupon?.discountAmmount ||
                                  coupon?.discountParcent}{" "}
                                {coupon.discountAmmount ? "NC" : "%"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {coupon?.maxUses
                                  ? `${coupon?.used || 0}/${coupon.maxUses}`
                                  : "Unlimited"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {getDate(coupon?.endDate)}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge
                                  className={getStatusColor(coupon, false)}
                                >
                                  {getStatusColor(coupon, true)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatus(
                                          !coupon?.isActive,
                                          coupon._id
                                        )
                                      }
                                    >
                                      {coupon?.isActive
                                        ? "Deactivate"
                                        : "Activate"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() =>
                                        handleDelete(coupon._id, "product")
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="coin">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-full inline-block align-middle">
                  <div className="overflow-hidden p-1.5">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            Token
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Amount
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Usage Count
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Status
                          </TableHead>
                          <TableHead className="text-right whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coinCoupons.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No coin coupons found. Create your first coupon!
                            </TableCell>
                          </TableRow>
                        ) : (
                          coinCoupons.map((coupon) => (
                            <TableRow key={coupon.id}>
                              <TableCell
                                className="font-medium whitespace-nowrap cursor-pointer hover:text-primary flex items-center gap-2"
                                onClick={() => handleCopyToken(coupon.token)}
                              >
                                {coupon.token}
                                <Copy className="h-3 w-3" />
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {coupon?.coinAmmount} NC
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                {coupon?.maxUses
                                  ? `${coupon?.used || 0}/${coupon.maxUses}`
                                  : "Unlimited"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge
                                  className={getStatusColor(coupon, false)}
                                >
                                  {coupon.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right whitespace-nowrap">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatus(
                                          !coupon?.isActive,
                                          coupon._id
                                        )
                                      }
                                    >
                                      {coupon?.isActive
                                        ? "Deactivate"
                                        : "Activate"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() =>
                                        handleDelete(coupon.id, "coin")
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Coupons;
