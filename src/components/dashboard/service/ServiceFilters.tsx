
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceFiltersProps {
  ipSetFilter: string;
  typeFilter: string;
  onIpSetFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export const ServiceFilters = ({
  ipSetFilter,
  typeFilter,
  onIpSetFilterChange,
  onTypeFilterChange,
}: ServiceFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-muted-foreground" />
      <Select value={ipSetFilter} onValueChange={onIpSetFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by IP Set" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All IP Sets</SelectItem>
          <SelectItem value="103.211">103.211</SelectItem>
          <SelectItem value="103.157">103.157</SelectItem>
          <SelectItem value="157.15">157.15</SelectItem>
          <SelectItem value="38.3">38.3</SelectItem>
          <SelectItem value="161.248">161.248</SelectItem>
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by OS Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All OS Types</SelectItem>
          <SelectItem value="Linux-Ubuntu">Linux-Ubuntu</SelectItem>
          <SelectItem value="Linux-CentOS">Linux-CentOS</SelectItem>
          <SelectItem value="Windows">Windows</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
