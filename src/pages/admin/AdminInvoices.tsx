import { Card } from "@/components/ui/card";

const AdminInvoices = () => {
  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h1 className="text-3xl font-bold mb-6">Invoice Management</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">Invoice management interface will be implemented here.</p>
        </Card>
      </div>
    </main>
  );
};

export default AdminInvoices;