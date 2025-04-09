import { Globe, Terminal, Server, Check, Copy, Hash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ServiceCredentialsProps {
  credentials: {
    ipAddress: string;
    username: string;
    password: string;
  };
}

export const ServiceCredentials = ({
  credentials,
}: ServiceCredentialsProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${credentials.ipAddress}:${credentials.username}:${credentials.password}`);
      toast.success("IP Address copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy IP Address");
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl border dark:border-white/5">
      <div className="flex items-start gap-5 ">
        <h3 className="text-base font-medium text-foreground mb-4">
          Access Credentials
        </h3>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-700 cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={copyToClipboard}
        >
          <span className="text-[10px] font-medium">Copy All</span>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            {copied ? (
              <Check className="h-3 w-3 text-green-500" style={{width: "10px", height: "10px"}}/>
            ) : (
              <Copy style={{width: "10px", height: "10px"}}/>
            )}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Globe, label: "IP Address", value: credentials.ipAddress },
          { icon: Terminal, label: "Username", value: credentials.username },
          { icon: Server, label: "Password", value: credentials.password },
        ].map((cred, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-card/40 backdrop-blur-xl border dark:border-white/10 transition-all hover:bg-card/60 cursor-pointer group"
            onClick={() => handleCopy(cred.value, cred.label)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <cred.icon className="h-3.5 w-3.5" />
                <span className="text-sm">{cred.label}</span>
              </div>
              {copiedField === cred.label ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            <p className="text-sm font-medium text-blue-500 truncate">
              {cred.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
