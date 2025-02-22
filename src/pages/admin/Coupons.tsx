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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Coupons = () => {
  const { toast } = useToast();

  const productCoupons = [
    {
      id: 1,
      token: "SUMMER2024",
      label: "Festive",
      type: "percentage",
      discount: "20%",
      usageCount: "45/100",
      expiryDate: "2024-08-31",
      status: "active",
    },
    {
      id: 2,
      token: "WELCOME50",
      label: "Affiliate",
      type: "amount",
      discount: "50 NC",
      usageCount: "∞",
      expiryDate: "2024-12-31",
      status: "active",
    },
    {
      id: 3,
      token: "SPECIAL25",
      label: "Festive",
      type: "percentage",
      discount: "25%",
      usageCount: "98/100",
      expiryDate: "2024-06-30",
      status: "active",
    }
  ];

  const coinCoupons = [
    {
      id: 1,
      token: "FREECOINS100",
      amount: "100 NC",
      usageCount: "50/100",
      prohibitedUsers: ["user123", "user456"],
      status: "active",
    },
    {
      id: 2,
      token: "BONUS500",
      amount: "500 NC",
      usageCount: "10/50",
      prohibitedUsers: ["user789"],
      status: "active",
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleDelete = (id: number, type: 'product' | 'coin') => {
    toast({
      title: `${type === 'product' ? 'Product' : 'Coin'} Coupon Deleted`,
      description: "The coupon has been successfully deleted.",
    });
  };

  const handleToggleStatus = (id: number, currentStatus: string, type: 'product' | 'coin') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    toast({
      title: `${type === 'product' ? 'Product' : 'Coin'} Coupon ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `The coupon has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: "Copied to Clipboard",
      description: `Coupon code "${token}" has been copied to clipboard.`,
    });
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
                          <TableHead className="whitespace-nowrap">Token</TableHead>
                          <TableHead className="whitespace-nowrap">Label</TableHead>
                          <TableHead className="whitespace-nowrap">Type</TableHead>
                          <TableHead className="whitespace-nowrap">Discount</TableHead>
                          <TableHead className="whitespace-nowrap">Usage Count</TableHead>
                          <TableHead className="whitespace-nowrap">Expiry Date</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productCoupons.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-4">
                              No product coupons found. Create your first coupon!
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
                              <TableCell className="whitespace-nowrap">{coupon.label}</TableCell>
                              <TableCell className="capitalize whitespace-nowrap">{coupon.type}</TableCell>
                              <TableCell className="whitespace-nowrap">{coupon.discount}</TableCell>
                              <TableCell className="whitespace-nowrap">{coupon.usageCount}</TableCell>
                              <TableCell className="whitespace-nowrap">{coupon.expiryDate}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge className={getStatusColor(coupon.status)}>
                                  {coupon.status}
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
                                      onClick={() => handleToggleStatus(coupon.id, coupon.status, 'product')}
                                    >
                                      {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDelete(coupon.id, 'product')}
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
                          <TableHead className="whitespace-nowrap">Token</TableHead>
                          <TableHead className="whitespace-nowrap">Amount</TableHead>
                          <TableHead className="whitespace-nowrap">Usage Count</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                          <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
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
                              <TableCell className="whitespace-nowrap">{coupon.amount}</TableCell>
                              <TableCell className="whitespace-nowrap">{coupon.usageCount}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                <Badge className={getStatusColor(coupon.status)}>
                                  {coupon.status}
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
                                      onClick={() => handleToggleStatus(coupon.id, coupon.status, 'coin')}
                                    >
                                      {coupon.status === 'active' ? 'Deactivate' : 'Activate'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => handleDelete(coupon.id, 'coin')}
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
