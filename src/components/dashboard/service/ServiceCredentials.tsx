
import { Globe, Terminal, Server, Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ServiceCredentialsProps {
  credentials: {
    ipAddress: string;
    username: string;
    password: string;
  };
}

export const ServiceCredentials = ({ credentials }: ServiceCredentialsProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl border dark:border-white/5">
      <h3 className="text-base font-medium text-foreground mb-4">Access Credentials</h3>
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
            <p className="text-sm font-medium text-blue-500">{cred.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
