
import { AppWindow, Terminal, Edit2, Activity, Check, Copy, Hash, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface ServiceHeaderProps {
  nickname: string;
  id: string;
  type: string;
  status: string;
  date: Date;
}

export const ServiceHeader = ({ nickname: initialNickname, id, type, status, date }: ServiceHeaderProps) => {
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState(initialNickname);
  const [copied, setCopied] = useState(false);
  const isWindows = type.toLowerCase().includes('windows');
  const isRunning = status === 'running';

  const getServiceIcon = () => {
    if (isWindows) return <AppWindow className="h-4 w-4 text-blue-400" />;
    return <Terminal className="h-4 w-4 text-blue-400" />;
  };

  const handleSaveNickname = () => {
    setIsEditingNickname(false);
    toast.success("Nickname updated successfully");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast.success("Service ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy Service ID");
    }
  };

  const getDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {getServiceIcon()}
          <div>
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="h-8 text-lg font-bold"
                  autoFocus
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNickname}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {nickname || "unset"}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditingNickname(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {type} Server
            </p>
          </div>
        </div>

        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={copyToClipboard}
        >
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{id}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background/50">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Expires: {getDate(date)}</span>
      </div>
    </div>
  );
};
