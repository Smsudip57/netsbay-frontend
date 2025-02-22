import { Card } from "@/components/ui/card";
import { ServiceForm } from "@/components/admin/ServiceForm";

const AddService = () => {
  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h1 className="text-3xl font-bold mb-6">Add New Service</h1>
        <Card className="p-6">
          <ServiceForm />
        </Card>
      </div>
    </main>
  );
};

export default AddService;