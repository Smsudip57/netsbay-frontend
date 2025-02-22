
import { Settings, Terminal, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Toolkit = () => {
  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h2 className="text-3xl font-bold mb-2">Toolkit</h2>
        <p className="text-muted-foreground mb-6">Access your VPS management tools</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                <CardTitle>SSH Console</CardTitle>
              </div>
              <CardDescription>Access your server via web terminal</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Launch Console</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                <CardTitle>Server Config</CardTitle>
              </div>
              <CardDescription>Manage server settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Configure</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                <CardTitle>Proxy Fire</CardTitle>
              </div>
              <CardDescription>Manage proxy and firewall settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Configure Proxy</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Toolkit;
