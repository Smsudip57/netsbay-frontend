/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Eye, EyeOff, Loader2, Power, RotateCw, AlertCircle, Clock, ArrowUpDown, Info, Command, X } from "lucide-react";
import { io } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "./Config";

// Global API configuration


function TerminalPage() {
  // Connection states
  const [connectionString, setConnectionString] = useState("");
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [connectionTime, setConnectionTime] = useState<Date | null>(null);
  const [connectionDuration, setConnectionDuration] = useState<string>("00:00:00");
  const [activeTab, setActiveTab] = useState<"terminal" | "info">("terminal");

  // Terminal states
  const [terminalOutput, setTerminalOutput] = useState<Array<any>>([{
    text: "Terminal ready. Please connect to a Linux server.",
    type: "system",
    timestamp: new Date()
  }]);
  const [command, setCommand] = useState("");
  const [prompt, setPrompt] = useState("$ ");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastCommandTime, setLastCommandTime] = useState<Date | null>(null);
  const [showTimestamps, setShowTimestamps] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Connection details parsed from string
  const [ipAddress, setIpAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Update connection duration timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (connected && connectionTime) {
      timer = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - connectionTime.getTime();
        const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setConnectionDuration(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [connected, connectionTime]);

  // Connect to SSH server
  const handleConnect = async () => {
    setConnectionError(null);
    setIsLoading(true);
    addTerminalLine("Attempting to connect...", "system");

    // Parse connection string directly and get values
    let hostToConnect = "";
    let userToConnect = "";
    let passToConnect = "";

    try {
      const parts = connectionString.split(":");
      if (parts.length >= 3) {
        hostToConnect = parts[0];
        userToConnect = parts[1];
        passToConnect = parts[2];

        // Update state for other parts of the UI
        setIpAddress(hostToConnect);
        setUsername(userToConnect);
        setPassword(passToConnect);
      } else {
        setIsLoading(false);
        setConnectionError("Invalid connection string format. Use IP:USER:PASS");
        addTerminalLine("Connection failed: Invalid format. Use IP:USER:PASS", "error");
        return;
      }
    } catch (error) {
      setIsLoading(false);
      setConnectionError("Failed to parse connection string");
      addTerminalLine("Connection failed: Could not parse connection string", "error");
      return;
    }

    // Validate connection parameters
    if (!hostToConnect || !userToConnect) {
      setIsLoading(false);
      setConnectionError("Host and username are required");
      addTerminalLine("Connection failed: Host and username are required", "error");
      return;
    }

    console.log(`Preparing to connect to ${hostToConnect} as ${userToConnect}`);

    try {
      // Disconnect any existing connection first
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      // Create new socket connection
      const socket = io(`${API_BASE_URL}/api/toolkit/terminal`, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 3,
        timeout: 10000
      });

      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (!connected) {
          console.error('Connection timeout');
          addTerminalLine("Connection timeout. Please try again.", "error");
          setConnectionError("Connection timeout");
          setIsLoading(false);

          if (socket) {
            socket.disconnect();
          }
        }
      }, 15000); // 15 seconds timeout

      // Store socket in ref for cleanup
      socketRef.current = socket;

      // Set up connection event handlers
      socket.on('connect', () => {
        console.log(`WebSocket connected, checking socket readiness`);

        // First check if socket is ready by sending a socket-check
        socket.emit('socket-check', { timestamp: Date.now() }, (response: any) => {
          if (response && response.status === 'ready') {
            console.log(`Socket is ready, sending SSH connection request to ${hostToConnect}`);

            // Now send the SSH connection request with explicit parameters
            socket.emit('ssh-connect', {
              host: hostToConnect,
              port: 22,
              username: userToConnect,
              password: passToConnect
            });
          } else {
            console.log('Socket not ready or no response, trying alternative approach');

            // If no response, try a different approach with a delay
            setTimeout(() => {
              if (socket.connected) {
                console.log(`Sending delayed SSH connection request to ${hostToConnect}`);
                socket.emit('ssh-connect', {
                  host: hostToConnect,
                  port: 22,
                  username: userToConnect,
                  password: passToConnect
                });
              }
            }, 1000);
          }
        });
      });

      socket.on('ssh-connected', () => {
        clearTimeout(connectionTimeout);
        setConnected(true);
        setConnectionError(null);
        setConnectionTime(new Date());
        addTerminalLine(`Connected to ${hostToConnect} as ${userToConnect}`, "system");
        setIsLoading(false);

        // Focus the input field after connection
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 100);
      });

      socket.on('ssh-error', (data) => {
        clearTimeout(connectionTimeout);
        console.error('SSH error:', data);

        // If we get a localhost error or empty host error, try again with explicit parameters
        if (data.message && (data.message.includes('ECONNREFUSED 127.0.0.1:22') ||
          data.message.includes('Host is required'))) {
          console.log('Retrying with explicit host parameter');

          // Try again with a different approach
          setTimeout(() => {
            if (socket.connected) {
              console.log(`Retrying SSH connection to ${hostToConnect}`);
              socket.emit('ssh-connect', {
                host: hostToConnect,
                port: 22,
                username: userToConnect,
                password: passToConnect,
                retry: true
              });
            }
          }, 1000);
        } else {
          setConnectionError(data.message || "Connection failed");
          addTerminalLine(`Connection error: ${data.message || "Unknown error"}`, "error");
          setIsLoading(false);
        }
      });

      socket.on('ssh-data', (data) => {
        addTerminalLine(data.data, "output");
      });

      socket.on('ssh-closed', (data) => {
        setConnected(false);
        setConnectionTime(null);
        setConnectionDuration("00:00:00");
        addTerminalLine(`Connection closed: ${data.message || "Unknown reason"}`, "system");
      });

      socket.on('connect_error', (error) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket connection error:', error);
        setConnectionError(`WebSocket connection error: ${error.message}`);
        addTerminalLine(`WebSocket connection error: ${error.message}`, "error");
        setIsLoading(false);
      });

    } catch (error: any) {
      console.error('Connection error:', error);
      setConnectionError(error.message || "Connection failed");
      addTerminalLine(`Connection error: ${error.message || "Unknown error"}`, "error");
      setIsLoading(false);
    }
  };

  // Helper function to add lines to terminal with type
  const addTerminalLine = (text: string, type: "command" | "output" | "error" | "system" = "output") => {
    // If the text contains a prompt pattern like [user@host ~]#, extract it
    const promptRegex = /\[(.*?)@(.*?)\s+(.*?)\](?:\#|\$)/;
    const promptMatch = text.match(promptRegex);

    if (promptMatch && type === "output") {
      // Update the prompt if we found one in the output
      setPrompt(`[${promptMatch[1]}@${promptMatch[2]} ${promptMatch[3]}]# `);

      // If this is just a prompt line with no other content, don't add it to output
      if (text.trim() === `[${promptMatch[1]}@${promptMatch[2]} ${promptMatch[3]}]#` ||
        text.trim() === `[${promptMatch[1]}@${promptMatch[2]} ${promptMatch[3]}]# `) {
        return;
      }
    }

    // For Ubuntu/Debian systems, also check for the username@hostname:path$ format
    const ubuntuPromptRegex = /([\w-]+@[\w-]+:[~\/\w-]+[$#])\s*/;
    const ubuntuPromptMatch = text.match(ubuntuPromptRegex);

    if (ubuntuPromptMatch && type === "output") {
      // Update the prompt for Ubuntu style
      setPrompt(ubuntuPromptMatch[1] + ' ');

      // If this is just a prompt line with no other content, don't add it to output
      if (text.trim() === ubuntuPromptMatch[1] ||
        text.trim() === ubuntuPromptMatch[1] + ' ') {
        return;
      }
    }

    setTerminalOutput(prev => [...prev, { text, type, timestamp: new Date() }]);
    
    if (type === "command") {
      setLastCommandTime(new Date());
    }
  };

  // Disconnect from SSH server
  const handleDisconnect = () => {
    if (socketRef.current) {
      socketRef.current.emit('ssh-disconnect');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnected(false);
    setConnectionTime(null);
    setConnectionDuration("00:00:00");
    setPrompt("$ ");
    addTerminalLine("Disconnected from server", "system");
  };

  // Execute command via WebSocket
  const executeCommand = () => {
    if (!command.trim() || !socketRef.current) return;

    // Add command to terminal display with the current prompt
    addTerminalLine(`${prompt}${command}`, "command");
    
    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Send command via WebSocket
    socketRef.current.emit('ssh-command', { command });

    setCommand("");
  };

  // Clear terminal output
  const clearTerminal = () => {
    setTerminalOutput([{
      text: "Terminal cleared.",
      type: "system",
      timestamp: new Date()
    }]);
  };

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Scroll terminal to bottom when output changes
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Handle key presses in command input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      // Navigate command history up
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === 'ArrowDown') {
      // Navigate command history down
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    } else if (e.key === 'Tab') {
      // Prevent tab from changing focus
      e.preventDefault();
      // Tab completion could be implemented here
    } else if (e.key === 'c' && e.ctrlKey) {
      // Handle Ctrl+C (interrupt)
      e.preventDefault();
      handleInterrupt();
    } else if (e.key === 'l' && e.ctrlKey) {
      // Handle Ctrl+L (clear screen)
      e.preventDefault();
      clearTerminal();
    }
    // Don't prevent default for left/right arrow keys
    // This allows the native cursor movement to work
  };

  // Handle interrupts
  const handleInterrupt = () => {
    if (!connected || !socketRef.current) return;

    addTerminalLine(`${prompt}^C`, "command");

    socketRef.current.emit('ssh-interrupt');

    setCommand("");
  };

  const handleTerminalClick = () => {
    if (inputRef.current && connected) {
      inputRef.current.focus();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const renderTerminalLine = (line: any, index: number) => {
    if (typeof line === 'string') {
      return <div key={index} className="whitespace-pre-wrap mb-1 text-white">{line}</div>;
    }

    // Optional timestamp prefix
    const timestamp = showTimestamps && line.timestamp ? (
      <span className="text-gray-500 text-xs mr-2">[{formatTimestamp(line.timestamp)}]</span>
    ) : null;

    switch (line.type) {
      case 'command': {
        const commandText = line.text;
        const promptRegex = /\[(.*?)@(.*?)\s+(.*?)\](?:\#|\$)\s*/;
        const promptMatch = commandText.match(promptRegex);
        if (promptMatch) {
          const prompt = promptMatch[0];
          const commandWithoutPrompt = commandText.substring(promptMatch[0].length);
          const commandParts = commandWithoutPrompt.split(' ');
          const firstWord = commandParts.shift();
          const restOfCommand = commandParts.join(' ');

          return (
            <div key={index} className="whitespace-pre-wrap mb-1 text-white group hover:bg-gray-900/30 px-1 rounded">
              {timestamp}
              <span className="text-white">{prompt}</span>
              <span className="text-yellow-400">{firstWord}</span>
              {restOfCommand ? <span className="text-white">{` ${restOfCommand}`}</span> : ''}
            </div>
          );
        } else {
          const commandParts = commandText.split(' ');
          const firstWord = commandParts.shift();
          const restOfCommand = commandParts.join(' ');

          return (
            <div key={index} className="whitespace-pre-wrap mb-1 text-white group hover:bg-gray-900/30 px-1 rounded">
              {timestamp}
              <span className="text-yellow-400">{firstWord}</span>
              {restOfCommand ? <span className="text-white">{` ${restOfCommand}`}</span> : ''}
            </div>
          );
        }
      }
      case 'error':
        return (
          <div key={index} className="whitespace-pre-wrap mb-1 text-red-400 group hover:bg-gray-900/30 px-1 rounded">
            {timestamp}
            {line.text}
          </div>
        );
      case 'system':
        return (
          <div key={index} className="whitespace-pre-wrap mb-1 text-blue-400 group hover:bg-gray-900/30 px-1 rounded">
            {timestamp}
            {line.text}
          </div>
        );
      case 'output':
      default: {
        const outputText = line.text;
        const centosPromptRegex = /(\[.*?@.*?\s+.*?\](?:\#|\$)\s*)(.*)/;
        const ubuntuPromptRegex = /([\w-]+@[\w-]+:[~/\w-]+[$#]\s*)(.*)/;

        const centosPromptMatch = outputText.match(centosPromptRegex);
        const ubuntuPromptMatch = outputText.match(ubuntuPromptRegex);

        if (centosPromptMatch && centosPromptMatch[2]) {
          const prompt = centosPromptMatch[1];
          const commandText = centosPromptMatch[2];

          // Split command into words
          const commandParts = commandText.split(' ');
          const firstWord = commandParts.shift();
          const restOfCommand = commandParts.join(' ');

          return (
            <div key={index} className="whitespace-pre-wrap mb-1 text-white group hover:bg-gray-900/30 px-1 rounded">
              {timestamp}
              <span className="text-white">{prompt}</span>
              <span className="text-yellow-400">{firstWord}</span>
              {restOfCommand ? <span className="text-white">{` ${restOfCommand}`}</span> : ''}
            </div>
          );
        } else if (ubuntuPromptMatch && ubuntuPromptMatch[2]) {
          const prompt = ubuntuPromptMatch[1];
          const commandText = ubuntuPromptMatch[2];

          const commandParts = commandText.split(' ');
          const firstWord = commandParts.shift();
          const restOfCommand = commandParts.join(' ');

          return (
            <div key={index} className="whitespace-pre-wrap mb-1 text-white group hover:bg-gray-900/30 px-1 rounded">
              {timestamp}
              <span className="text-white">{prompt}</span>
              <span className="text-yellow-400">{firstWord}</span>
              {restOfCommand ? <span className="text-white">{` ${restOfCommand}`}</span> : ''}
            </div>
          );
        }

        // Colorize common output
        const formattedText = outputText;
        
        // Colorize directory listings
        if (outputText.includes('drwx') || outputText.match(/^total \d+/)) {
          const lines = outputText.split('\n');
          return (
            <div key={index} className="whitespace-pre-wrap mb-1 text-white group hover:bg-gray-900/30 px-1 rounded">
              {timestamp}
              {lines.map((line, i) => {
                // Directory line
                if (line.startsWith('d')) {
                  return (
                    <div key={i} className="flex">
                      <span className="text-blue-400">{line.substring(0, 10)}</span>
                      <span className="text-white">{line.substring(10)}</span>
                    </div>
                  );
                }
                // File line
                else if (line.match(/^-[rwx-]{9}/)) {
                  return (
                    <div key={i} className="flex">
                      <span className="text-green-400">{line.substring(0, 10)}</span>
                      <span className="text-white">{line.substring(10)}</span>
                    </div>
                  );
                }
                // Link line
                else if (line.startsWith('l')) {
                  return (
                    <div key={i} className="flex">
                      <span className="text-cyan-400">{line.substring(0, 10)}</span>
                      <span className="text-white">{line.substring(10)}</span>
                    </div>
                  );
                }
                // Total line or other
                else {
                  return <div key={i} className="text-white">{line}</div>;
                }
              })}
            </div>
          );
        }

        return (
          <div key={index} className="whitespace-pre-wrap mb-1 text-white group hover:bg-gray-900/30 px-1 rounded">
            {timestamp}
            {formattedText}
          </div>
        );
      }
    }
  };

  const InfoPanel = () => (
    <div className="p-4 space-y-4 bg-gray-950 rounded-b-lg h-[400px] max-h-[60vh] overflow-auto">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Connection Info</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-900 p-2 rounded flex flex-col">
            <span className="text-gray-400 text-xs">Host</span>
            <span className="text-white font-mono">{ipAddress || "Not connected"}</span>
          </div>
          <div className="bg-gray-900 p-2 rounded flex flex-col">
            <span className="text-gray-400 text-xs">User</span>
            <span className="text-white font-mono">{username || "Not connected"}</span>
          </div>
          <div className="bg-gray-900 p-2 rounded flex flex-col">
            <span className="text-gray-400 text-xs">Connected Since</span>
            <span className="text-white font-mono">
              {connectionTime ? connectionTime.toLocaleTimeString() : "Not connected"}
            </span>
          </div>
          <div className="bg-gray-900 p-2 rounded flex flex-col">
            <span className="text-gray-400 text-xs">Session Duration</span>
            <span className="text-white font-mono">{connectionDuration}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Command Statistics</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-900 p-2 rounded flex flex-col">
            <span className="text-gray-400 text-xs">Commands Executed</span>
            <span className="text-white font-mono">{commandHistory.length}</span>
          </div>
          <div className="bg-gray-900 p-2 rounded flex flex-col">
            <span className="text-gray-400 text-xs">Last Command</span>
            <span className="text-white font-mono">
              {lastCommandTime ? formatTimestamp(lastCommandTime) : "None"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Terminal Help</h3>
        <div className="bg-gray-900 p-3 rounded text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-mono bg-gray-800 px-1 rounded">Enter</span>
              <span className="text-gray-300">Execute command</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono bg-gray-800 px-1 rounded">Up/Down</span>
              <span className="text-gray-300">Command history</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono bg-gray-800 px-1 rounded">Ctrl+C</span>
              <span className="text-gray-300">Interrupt command</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono bg-gray-800 px-1 rounded">Ctrl+L</span>
              <span className="text-gray-300">Clear terminal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Command History</h3>
        <div className="bg-gray-900 p-2 rounded max-h-32 overflow-y-auto">
          {commandHistory.length > 0 ? (
            <div className="space-y-1">
              {commandHistory.slice().reverse().map((cmd, idx) => (
                <div 
                  key={idx} 
                  className="text-sm font-mono text-white hover:bg-gray-800 p-1 rounded cursor-pointer"
                  onClick={() => {
                    setCommand(cmd);
                    setActiveTab("terminal");
                    if (inputRef.current) inputRef.current.focus();
                  }}
                >
                  <span className="text-gray-500 mr-2">{idx + 1}.</span>
                  {cmd}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm italic">No commands executed yet</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-full p-6 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <TerminalIcon className="h-6 w-6" />
          Terminal
          {connected && (
            <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-500/20">
              Connected
            </Badge>
          )}
        </h1>
        <div className="flex items-center gap-2">
          {connected && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() => setShowTimestamps(!showTimestamps)}
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showTimestamps ? "Hide timestamps" : "Show timestamps"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <Card className="shadow-md border border-gray-200 dark:border-gray-800">
        <CardHeader className="py-3 px-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === "terminal" 
                    ? "bg-primary text-white" 
                    : "text-muted-foreground hover:bg-gray-800"
                }`}
                onClick={() => setActiveTab("terminal")}
              >
                <Command className="h-4 w-4" />
                Terminal
              </button>
              <button 
                className={`text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  activeTab === "info" 
                    ? "bg-primary text-white" 
                    : "text-muted-foreground hover:bg-gray-800"
                }`}
                onClick={() => setActiveTab("info")}
              >
                <Info className="h-4 w-4" />
                Info
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {connected && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-sm"
                          onClick={clearTerminal}
                        >
                          <RotateCw className="h-3.5 w-3.5 mr-2" />
                          Clear
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Clear terminal output (Ctrl+L)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 text-sm"
                          onClick={handleDisconnect}
                        >
                          <Power className="h-3.5 w-3.5 mr-2" />
                          Disconnect
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Close SSH connection
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Terminal connection form */}
          {!connected ? (
            <div className="p-4">
              <div className="space-y-1.5 mb-3">
                <Label htmlFor="connectionString" className="text-xs font-medium">Connection String</Label>
                <div className="flex gap-2">
                  <Input
                    id="connectionString"
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleConnect();
                      }
                    }}
                    placeholder="IP:USERNAME:PASSWORD"
                    className="h-8 text-sm font-mono"
                  />
                  <Button
                    onClick={handleConnect}
                    disabled={!connectionString || isLoading}
                    className="w-max h-8 text-sm bg-primary hover:bg-primary/90 dark:text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Format: IP address, username, and password separated by colons
                </p>
              </div>
              
              {connectionString && (
                <div className="mt-2">
                  {(() => {
                    const parts = connectionString.split(":");
                    if (parts.length < 3) {
                      return (
                        <Alert className="mb-3 py-2 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
                          <AlertCircle className="h-4 w-4 text-amber-800 dark:text-amber-300 mr-2" />
                          <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
                            Invalid format. Please use IP:USERNAME:PASSWORD format
                          </AlertDescription>
                        </Alert>
                      );
                    }

                    const [host, user, pass] = parts;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 dark:bg-gray-900 rounded-md p-3 border border-gray-200 dark:border-gray-800"
                      >
                        <h4 className="text-xs font-semibold mb-2 text-muted-foreground">Connection Details</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">Host:</span>
                            <span className="font-mono">{host}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">User:</span>
                            <span className="font-mono">{user}</span>
                          </div>
                          <div className="flex items-center col-span-2">
                            <span className="text-muted-foreground mr-2">Password:</span>
                            <span className="font-mono">
                              {showPassword ? pass : pass.replace(/./g, '•')}
                            </span>
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="ml-2 p-1 rounded-md text-muted-foreground focus:outline-none hover:opacity-80"
                              type="button"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ?
                                <EyeOff className="h-3.5 w-3.5" /> :
                                <Eye className="h-3.5 w-3.5" />
                              }
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
              )}
              
              <AnimatePresence>
                {connectionError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert className="mt-3 py-2 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                      <AlertCircle className="h-4 w-4 text-red-800 dark:text-red-300 mr-2" />
                      <AlertDescription className="text-xs text-red-800 dark:text-red-300">
                        {connectionError}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          {/* Terminal content area */}
          {activeTab === "terminal" ? (
            <div
              ref={terminalContainerRef}
              className="bg-black p-4 rounded-b-lg overflow-y-auto font-mono text-sm"
              style={{ 
                height: "400px", 
                maxHeight: "60vh",
                backgroundImage: "linear-gradient(to bottom, #121212, #111111)" 
              }}
              onClick={handleTerminalClick}
            >
              <div ref={terminalRef} className="terminal-output">
                {terminalOutput.map((line, index) => renderTerminalLine(line, index))}
              </div>

              {/* Command input area */}
              {connected && (
                <div className="flex items-center mt-2 bg-gray-900/30 rounded py-1 px-2">
                  <span className="text-green-400 mr-1">{prompt}</span>
                  <div className="flex-1 relative">
                    {/* Actual input field */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full bg-transparent outline-none border-none font-mono"
                      style={{
                        color: 'transparent',
                        caretColor: 'white'
                      }}
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                    />

                    {/* Overlay for highlighting first word */}
                    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none whitespace-pre">
                      {command && command.length > 0 ? (
                        (() => {
                          const firstSpace = command.indexOf(' ');
                          if (firstSpace === -1) {
                            // No spaces, just one word
                            return <span className="text-yellow-400">{command}</span>;
                          } else {
                            // Has spaces, split into first word and rest
                            const firstWord = command.substring(0, firstSpace);
                            const restOfCommand = command.substring(firstSpace);
                            return (
                              <>
                                <span className="text-yellow-400">{firstWord}</span>
                                <span className="text-white">{restOfCommand}</span>
                              </>
                            );
                          }
                        })()
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <InfoPanel />
          )}
        </CardContent>
        
        {connected && (
          <CardFooter className="p-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                SSH
              </Badge>
              <span>{ipAddress}</span>
              <span>•</span>
              <span>{username}</span>
            </div>
            <div>
              <Clock className="h-3 w-3 inline mr-1" />
              {connectionDuration}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default TerminalPage;