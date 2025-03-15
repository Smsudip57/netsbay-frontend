
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { Routes, Route } from "react-router-dom";
import AddService from "./AddService";
import AdminServices from "./AdminServices";
import AdminProducts from "./AdminProducts";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import AdminUsers from "./AdminUsers";
import UserDetails from "./UserDetails";
import UserInvoices from "./UserInvoices";
import AdminAnnouncements from "./AdminAnnouncements";
import AdminRequests from "./AdminRequests";
import AdminInvoices from "./AdminInvoices";
import AdminLogs from "./AdminLogs";
import AdminConstants from "./AdminConstants";
import Coupons from "./Coupons";
import AddCoupon from "./AddCoupon";
import AddCoinCoupon from "./AddCoinCoupon";

const DashboardHome = () => {
  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard.</p>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold mb-2">Service Management</h3>
            <p className="text-sm text-muted-foreground">Add and manage services</p>
          </div>
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold mb-2">Product Management</h3>
            <p className="text-sm text-muted-foreground">Manage products and inventory</p>
          </div>
          <div className="p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold mb-2">Request Management</h3>
            <p className="text-sm text-muted-foreground">Handle user requests and support</p>
          </div>
        </div>
      </div>
    </main>
  );
};

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="add-service" element={<AddService />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="users/:id/invoices" element={<UserInvoices />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="coupons/add" element={<AddCoupon />} />
            <Route path="coupons/add-coin" element={<AddCoinCoupon />} />
            <Route path="constants" element={<AdminConstants />} />
            <Route path="logs" element={<AdminLogs />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
