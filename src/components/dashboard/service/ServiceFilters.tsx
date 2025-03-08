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
  ipSetList: string[];
  typeList: string[];
  onIpSetFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export const ServiceFilters = ({
  ipSetFilter,
  typeFilter,
  ipSetList,
  typeList,
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
          {ipSetList.map((ip) => (
            <SelectItem key={ip} value={ip}>
              {ip}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Filter by OS Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All OS Types</SelectItem>
          {typeList.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
