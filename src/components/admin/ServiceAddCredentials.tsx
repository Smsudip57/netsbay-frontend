import { Globe, Terminal, Server, Check, Copy, Hash, File } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import axios from "axios";

interface ServiceCredentialsProps {
  service: any;
  setService: any;
}

export const ServiceCredentials = ({
  service,
  setService,
}: ServiceCredentialsProps) => {
  const [copied, setCopied] = useState(false);
  const [credentials, setCredentials] = useState({
    ipAddress: service?.ipAddress ? service?.ipAddress : "",
    username: service?.username ? service?.username : "",
    password: service?.password ? service?.password : "",
  });

  const handleSaveCredentials = async () => {
    try {
      const response = await axios.post(
        "/api/admin/update_service",
        {
          serviceId: service?.serviceId,
          ...credentials,
        },
        {
          withCredentials: true,
        }
      );
      if (response?.data) {
        toast.success("Credentials saved successfully");
        if (response?.data?.service) {
          console.log(response?.data?.service);
          setCredentials({
            ipAddress: response?.data?.service?.ipAddress,
            username: response?.data?.service?.username,
            password: response?.data?.service?.password,
          });
          setService(response?.data?.service);
          setCopied(true);
          setTimeout(() => setCopied(false), 6000);
        }
      }
    } catch (error) {
      console.error("Error saving credentials:", error);
      toast.error("Failed to save credentials");
    }
  };

  return (
    <div className="w-full ">
      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl border dark:border-white/5 mb-12">
        <div className="flex items-start gap-5 ">
          <h3 className="text-base font-medium text-foreground mb-4">
            Update Credentials
          </h3>
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
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <cred.icon className="h-3.5 w-3.5" />
                  <span className="text-sm">{cred.label}</span>
                </div>
              </div>
              <Input
                className="text-sm font-medium text-blue-500 truncate"
                type="text"
                placeholder={`Enter ${cred.label.toLowerCase()}`}
                onChange={(e) => {
                  const key =
                    cred.label === "IP Address"
                      ? "ipAddress"
                      : cred.label.toLowerCase();

                  setCredentials({ ...credentials, [key]: e.target.value });
                }}
                value={cred.value}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end w-full mt-4">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700 cursor-pointer hover:bg-accent/50 text-sm transition-colors ${
              copied ? "bg-green-500" : "bg-transparent"
            }`}
            onClick={handleSaveCredentials}
          >
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
              {copied ? (
                <Check style={{ width: "1em", height: "1em" }} />
              ) : (
                <File style={{ width: "1em", height: "1em" }} />
              )}
            </Button>
            <span className="font-medium">{copied ? "Saved" : "Save"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCredentials;
