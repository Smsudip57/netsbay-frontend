
import { List, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  viewType: "list" | "cards";
  onViewChange: (view: "list" | "cards") => void;
}

export const ViewToggle = ({ viewType, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={viewType === "list" ? "default" : "outline"}
        className="flex items-center gap-2"
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4" />
        <span>List View</span>
      </Button>
      <Button
        variant={viewType === "cards" ? "default" : "outline"}
        className="flex items-center gap-2"
        onClick={() => onViewChange("cards")}
      >
        <Grid className="h-4 w-4" />
        <span>Card View</span>
      </Button>
    </div>
  );
};

