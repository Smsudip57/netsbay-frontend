import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  Settings,
  CheckCircle,
  XCircle,
  Save,
  RefreshCw,
  Server,
  FileText,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {CONFIG_API } from "./Config";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfigData {
  os: string;
  hostname: string;
  kernel: string;
  cpu: {
    model: string;
    cores: number;
    threads: number;
  };
  memory: {
    total: string;
    used: string;
    free: string;
  };
  disk: {
    total: string;
    used: string;
    free: string;
  };
  network: {
    interfaces: Array<{
      name: string;
      ipAddress: string;
      macAddress: string;
    }>;
  };
  uptime: string;
  loadAverage: string[];
}

function ConfigPage() {
  const navigate = useNavigate();
  
  // SSH Connection states
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("22");
  const [username, setUsername] = useState("root");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Config states
  const [isLoading, setIsLoading] = useState(false);
  const [configFiles, setConfigFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [saveMessage, setSaveMessage] = useState<{type: "success" | "error", text: string} | null>(null);
  
  // New state for connection method
  const [connectionMethod, setConnectionMethod] = useState<"direct" | "separate">("separate");
  const [connectionString, setConnectionString] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Parse connection string
  const parseConnectionString = (str: string) => {
    try {
      const parts = str.split(":");
      if (parts.length >= 3) {
        setIpAddress(parts[0]);
        setUsername(parts[1]);
        setPassword(parts[2]);
        return true;
      } else {
        setConnectionError("Invalid connection string format. Use IP:USER:PASS");
        toast.error("Invalid connection string format. Use IP:USER:PASS");
        return false;
      }
    } catch (error) {
      setConnectionError("Failed to parse connection string");
      toast.error("Failed to parse connection string");
      return false;
    }
  };

  // Connect to SSH server
  const handleConnect = async () => {
    setConnectionError(null);
    setIsLoading(true);

    // If using direct method, parse the connection string first
    if (connectionMethod === "direct") {
      if (!parseConnectionString(connectionString)) {
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:3000/api/toolkit/proxy/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: ipAddress,
          port: parseInt(port),
          username,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setConnected(true);
        toast.success("Connected successfully!");
        await fetchConfigFiles();
      } else {
        setConnectionError(data.message || "Failed to connect");
        toast.error(data.message || "Failed to connect");
      }
    } catch (error: any) {
      setConnectionError(error.message || "Connection failed");
      toast.error(error.message || "Connection failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available config files
  const fetchConfigFiles = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(CONFIG_API.files, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: ipAddress,
          username,
          password,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.files) {
        setConfigFiles(data.files);
        if (data.files.length > 0) {
          setSelectedFile(data.files[0]);
        }
        toast.success("Configuration files loaded");
      } else {
        toast.error(data.message || "Failed to fetch configuration files");
      }
    } catch (error: any) {
      console.error("Failed to fetch config files:", error);
      toast.error(error.message || "Failed to fetch configuration files");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch file content when selected file changes
  useEffect(() => {
    if (selectedFile && connected) {
      fetchFileContent();
    }
  }, [selectedFile, connected]);

  // Fetch content of selected file
  const fetchFileContent = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(CONFIG_API.content, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: ipAddress,
          username,
          password,
          file: selectedFile,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFileContent(data.content);
        toast.success(`Loaded file: ${selectedFile}`);
      } else {
        setFileContent(`# Error loading file: ${data.message}`);
        toast.error(`Error loading file: ${data.message}`);
      }
    } catch (error: any) {
      setFileContent(`# Error loading file: ${error.message || "Unknown error"}`);
      toast.error(`Error loading file: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save file content
  const saveFileContent = async () => {
    setIsLoading(true);
    setSaveMessage(null);
    
    try {
      const response = await fetch(CONFIG_API.save, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: ipAddress,
          username,
          password,
          file: selectedFile,
          content: fileContent,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSaveMessage({
          type: "success",
          text: `File ${selectedFile} saved successfully!`
        });
        toast.success(`File ${selectedFile} saved successfully!`);
      } else {
        setSaveMessage({
          type: "error",
          text: `Failed to save file: ${data.message}`
        });
        toast.error(`Failed to save file: ${data.message}`);
      }
    } catch (error: any) {
      setSaveMessage({
        type: "error",
        text: `Failed to save file: ${error.message || "Unknown error"}`
      });
      toast.error(`Failed to save file: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    setConnected(false);
    setConfigFiles([]);
    setSelectedFile("");
    setFileContent("");
    setSaveMessage(null);
    setConnectionError(null);
    toast.info("Disconnected from server");
  };

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 dark:border-slate-800/50">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard/toolkit')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Toolkit
            </Button>
            <div>
              <h2 className="text-3xl font-bold">Configuration Manager</h2>
              <p className="text-muted-foreground">Manage server configuration files</p>
            </div>
          </div>
          {connected && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Connected to {ipAddress}
            </div>
          )}
        </div>

        {!connected ? (
          <Card className="shadow-sm">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-5 w-5" />
                SSH Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Connection Method Tabs */}
              <Tabs 
                defaultValue="separate" 
                className="w-full mb-6"
                onValueChange={(value) => setConnectionMethod(value as "direct" | "separate")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="separate">Separate Fields</TabsTrigger>
                  <TabsTrigger value="direct">Connection String</TabsTrigger>
                </TabsList>
                
                <TabsContent value="separate" className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ipAddress">IP Address</Label>
                      <Input
                        id="ipAddress"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="127.0.0.1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Port</Label>
                      <Input
                        id="port"
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        placeholder="22"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="root"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="direct" className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="connectionString">Connection String</Label>
                    <Input
                      id="connectionString"
                      value={connectionString}
                      onChange={(e) => setConnectionString(e.target.value)}
                      placeholder="127.0.0.1:root:password"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleConnect();
                        }
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      Format: IP address, username, and password separated by colons
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {connectionError && (
                <Alert className="mb-4 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <XCircle className="h-4 w-4 text-red-800 dark:text-red-300 mr-2" />
                  <AlertDescription className="text-red-800 dark:text-red-300">
                    {connectionError}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleConnect}
                disabled={(connectionMethod === "separate" && (!ipAddress || !username || !password)) || 
                         (connectionMethod === "direct" && !connectionString) || 
                         isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Server className="mr-2 h-4 w-4" />
                    Connect to Server
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Connected State */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gray-50/50 dark:bg-gray-900/50 border-b">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Configuration Editor
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      SSH
                    </Badge>
                    <span className="text-sm font-normal text-muted-foreground">
                      {username}@{ipAddress}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="configFile" className="text-sm font-medium mb-2 block">
                      Select Configuration File
                    </Label>
                    <Select
                      value={selectedFile}
                      onValueChange={setSelectedFile}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a file" />
                      </SelectTrigger>
                      <SelectContent>
                        {configFiles.map((file) => (
                          <SelectItem key={file} value={file}>
                            {file}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={fetchConfigFiles}
                          className="mt-6"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Files
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Reload configuration files from server
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {selectedFile && (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="fileContent" className="text-sm font-medium flex items-center gap-2">
                          Editing: <span className="font-mono text-primary">{selectedFile}</span>
                          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        </Label>
                        <div className="flex items-center gap-2">
                          {saveMessage && (
                            <span className={`text-sm ${saveMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                              {saveMessage.text}
                            </span>
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={saveFileContent}
                                  disabled={isLoading}
                                  size="sm"
                                >
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Save changes to server
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <Textarea
                        id="fileContent"
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        className="font-mono text-sm min-h-[400px] resize-none"
                        placeholder="File content will appear here..."
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Disconnect Button */}
            <div className="flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="destructive" 
                      onClick={handleDisconnect}
                      className="flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Disconnect
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Close SSH connection
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default ConfigPage;