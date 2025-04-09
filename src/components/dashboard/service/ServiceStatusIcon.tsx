
import { CheckCircle, CircleSlash, XCircle } from "lucide-react";

interface ServiceStatusIconProps {
  status: string;
}

export const ServiceStatusIcon = ({ status }: ServiceStatusIconProps) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <CircleSlash className="h-4 w-4 text-yellow-500" />;
    case "expired":
      return <XCircle className="h-4 w-4 text-orange-500" />;
    case "terminated":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};
