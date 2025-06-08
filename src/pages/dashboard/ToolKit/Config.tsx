export const API_BASE_URL = "http://localhost:3000";

// Terminal API endpoints
export const TERMINAL_API = {
  connect: `${API_BASE_URL}/api/toolkit/terminal/connect`,
  execute: `${API_BASE_URL}/api/toolkit/terminal/execute`,
};

// Proxy API endpoints
export const PROXY_API = {
  connect: `${API_BASE_URL}/api/toolkit/proxy/connect`,
  check: `${API_BASE_URL}/api/toolkit/proxy/check`,
  install: `${API_BASE_URL}/api/toolkit/proxy/install`,
  uninstall: `${API_BASE_URL}/api/toolkit/proxy/uninstall`,
  configure: `${API_BASE_URL}/api/toolkit/proxy/configure`,
  credentials: `${API_BASE_URL}/api/toolkit/proxy/credentials`,
  users: `${API_BASE_URL}/api/toolkit/proxy/users`,
  "reset-config": `${API_BASE_URL}/api/toolkit/proxy/reset-config`,
  "reset-users": `${API_BASE_URL}/api/toolkit/proxy/reset-users`,
};

// Config API endpoints
export const CONFIG_API = {
  connect: `${API_BASE_URL}/api/toolkit/config/connect`,
  files: `${API_BASE_URL}/api/toolkit/config/files`,
  content: `${API_BASE_URL}/api/toolkit/config/content`,
  save: `${API_BASE_URL}/api/toolkit/config/save`,
};