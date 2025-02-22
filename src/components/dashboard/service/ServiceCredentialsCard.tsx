
import { Key, Globe, User, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceCredentialsCardProps {
  credentials: {
    ipAddress: string;
    username: string;
    password: string;
  };
}

export const ServiceCredentialsCard = ({ credentials }: ServiceCredentialsCardProps) => {
  const credentialItems = [
    { icon: Globe, label: "IP Address", value: credentials.ipAddress },
    { icon: User, label: "Username", value: credentials.username },
    { icon: Lock, label: "Password", value: credentials.password },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-1.5 text-neutral-800">
          <Key className="h-4 w-4" />
          Credentials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {credentialItems.map((cred, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-2.5 rounded-lg border bg-card/50"
            >
              <div className="mt-0.5 text-muted-foreground">
                <cred.icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {cred.label}
                </p>
                <p className="text-sm font-medium">{cred.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
