import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pen, Loader, Trash, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useAppContext } from "@/context/context";
import { Switch } from "@/components/ui/switch";

interface ApiRes {
  _id: string;
  name: string;
  value: string;
  createdAt: Date;
}

interface DatacenterValue {
  location: string;
  datastore: string;
  status: boolean;
}

interface DatacenterApiRes {
  _id: string;
  name: string;
  value: DatacenterValue;
  createdAt: Date;
}

interface KeyInfo {
  name: string;
  header: string;
  placeholder: string;
}

// ListCard component for simple string-value constants
const ListCard: React.FC<{ data: ApiRes[]; keyInfo: KeyInfo }> = ({ data, keyInfo }) => {
  const [showmore, setShowmore] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const { showRebuildDialog, 
    setShowRebuildDialog, 
    handleRebuildRequest, 
    setDialogInfo, 
    setHandleRebuildRequest } = useAppContext();

  const [constants, setConstants] = useState<ApiRes[]>(data);

  useEffect(() => {
    setConstants(data);
  }, [data]);

  const handleCreate = async () => {
    if (inputValue.trim() === "") {
      setInputError(true);
      toast.error(`${keyInfo.header} is required`);
      return;
    }

    setCreateLoading(true);
    try {
      const res = await axios.post(
        "/api/admin/create_system",
        { name: keyInfo.name, value: inputValue },
        { withCredentials: true }
      );
      
      if (res?.data) {
        setInputValue("");
        setConstants([...constants, res?.data?.system]);
        toast.success(res?.data?.message || "Created successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create");
    } finally {
      setCreateLoading(false);
    }
  };

  const getDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteConfirmation = (id: string) => {
    setShowRebuildDialog(true);
    setDialogInfo({
      title: `Delete this ${keyInfo.header}?`,
      message: `delete this ${keyInfo.header.toLowerCase()}`,
      onclick: "Delete",
    });
    setHandleRebuildRequest(() => () => handleDelete(id));
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/delete_system`, {
        params: { id },
        withCredentials: true,
      });
      if (res?.data) {
        toast.success(res?.data?.message || "Deleted successfully");
        setConstants(constants.filter(item => item._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 mt-6">
      {constants?.length > 0 ? (
        constants?.slice(0, showmore ? constants.length : 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100/50 dark:border-slate-800/50"
          >
            <div>
              <span>{item.value}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="text-xs text-white border bg-red-500 transition-colors duration-200 hover:bg-red-600 py-1 px-2 rounded"
                onClick={() => handleDeleteConfirmation(item._id)}
              >
                Delete
              </button>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Created: {getDate(item.createdAt)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-slate-400 w-full text-center">
          No {keyInfo.header.toLowerCase()} found
        </p>
      )}
      
      {constants?.length > 5 && (
        <div
          className="flex justify-center text-sm mt-4 cursor-pointer hover:text-blue-500 transition-colors duration-200"
          onClick={() => setShowmore(!showmore)}
        >
          {showmore ? "Show Less" : "Show More"}
        </div>
      )}
      
      <div className="flex gap-3 mt-6">
        <input
          type="text"
          placeholder={keyInfo.placeholder}
          className={`flex-1 bg-gray-100 dark:bg-slate-800 p-2 rounded-md ${
            inputError ? "border border-red-500 outline-none" : ""
          }`}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setInputError(false);
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm flex gap-2 items-center disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleCreate}
          disabled={createLoading}
        >
          {createLoading ? (
            <Loader className="animate-spin" style={{ width: "1em", height: "1em" }} />
          ) : (
            <Pen style={{ width: ".8em", height: ".8em" }} />
          )}{" "}
          {createLoading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

// DatacenterCard component for complex datacenter objects
const DatacenterCard: React.FC<{ data: DatacenterApiRes[] }> = ({ data }) => {
  const [showmore, setShowmore] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [inputLocation, setInputLocation] = useState("");
  const [inputDatastore, setInputDatastore] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const { showRebuildDialog,
    setShowRebuildDialog,
    handleRebuildRequest,
    setDialogInfo,
    setHandleRebuildRequest } = useAppContext();

  const [datacenters, setDatacenters] = useState<DatacenterApiRes[]>(data);

  useEffect(() => {
    setDatacenters(data);
  }, [data]);

  const handleCreate = async () => {
    if (inputLocation.trim() === "" || inputDatastore.trim() === "") {
      setInputError(true);
      toast.error("Location and Datastore are required");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await axios.post(
        "/api/admin/create_system",
        { 
          name: "datacenter", 
          value: {
            location: inputLocation,
            datastore: inputDatastore,
            status: true // Default to active
          }
        },
        { withCredentials: true }
      );
      
      if (res?.data) {
        setInputLocation("");
        setInputDatastore("");
        setDatacenters([...datacenters, res?.data?.system]);
        toast.success(res?.data?.message || "Datacenter created successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create datacenter");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setUpdateLoading([...updateLoading, id]);
    try {
      const res = await axios.post(
        "/api/admin/update_system",
        { 
          id,
          value: { status: !currentStatus }
        },
        { withCredentials: true }
      );
      
      if (res?.data) {
        const updatedDatacenters = datacenters.map(center => 
          center._id === id 
            ? { ...center, value: { ...center.value, status: !currentStatus } } 
            : center
        );
        setDatacenters(updatedDatacenters);
        toast.success(res?.data?.message || "Status updated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update datacenter status");
    } finally {
      setUpdateLoading(updateLoading.filter(item => item !== id));
    }
  };

  const getDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteConfirmation = (id: string) => {
    setShowRebuildDialog(true);
    setDialogInfo({
      title: `Delete this datacenter?`,
      message: "delete this datacenter",
      onclick: "Delete",
    });
    setHandleRebuildRequest(() => () => handleDelete(id));
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`/api/admin/delete_system`, {
        params: { id },
        withCredentials: true,
      });
      if (res?.data) {
        toast.success(res?.data?.message || "Deleted successfully");
        setDatacenters(datacenters.filter(center => center._id !== id));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete datacenter");
    }
  };

  return (
    <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 mt-6">
      {datacenters?.length > 0 ? (
        datacenters?.slice(0, showmore ? datacenters.length : 5).map((datacenter, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100/50 dark:border-slate-800/50"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Location:</span>
                <span>{datacenter.value.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Datastore:</span>
                <span>{datacenter.value.datastore}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm">Status:</span>
                <Switch 
                  checked={datacenter.value.status} 
                  disabled={updateLoading.includes(datacenter._id)}
                  onCheckedChange={() => handleToggleStatus(datacenter._id, datacenter.value.status)}
                  className={`${updateLoading.includes(datacenter._id) ? 'opacity-50' : ''}`}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="text-xs text-white border bg-red-500 transition-colors duration-200 hover:bg-red-600 py-1 px-2 rounded"
                  onClick={() => handleDeleteConfirmation(datacenter._id)}
                >
                  Delete
                </button>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Created: {getDate(datacenter.createdAt)}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-slate-400 w-full text-center">
          No datacenters found
        </p>
      )}
      
      {datacenters?.length > 5 && (
        <div
          className="flex justify-center text-sm mt-4 cursor-pointer hover:text-blue-500 transition-colors duration-200"
          onClick={() => setShowmore(!showmore)}
        >
          {showmore ? "Show Less" : "Show More"}
        </div>
      )}
      
      <div className="flex flex-col gap-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter datacenter location"
              className={`w-full bg-gray-100 dark:bg-slate-800 p-2 rounded-md ${
                inputError && inputLocation.trim() === "" ? "border border-red-500 outline-none" : ""
              }`}
              value={inputLocation}
              onChange={(e) => {
                setInputLocation(e.target.value);
                setInputError(false);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Datastore</label>
            <input
              type="text"
              placeholder="Enter datastore name"
              className={`w-full bg-gray-100 dark:bg-slate-800 p-2 rounded-md ${
                inputError && inputDatastore.trim() === "" ? "border border-red-500 outline-none" : ""
              }`}
              value={inputDatastore}
              onChange={(e) => {
                setInputDatastore(e.target.value);
                setInputError(false);
              }}
            />
          </div>
        </div>
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm flex gap-2 items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          onClick={handleCreate}
          disabled={createLoading}
        >
          {createLoading ? (
            <Loader className="animate-spin" style={{ width: "1em", height: "1em" }} />
          ) : (
            <Pen style={{ width: ".8em", height: ".8em" }} />
          )}{" "}
          {createLoading ? "Creating..." : "Create Datacenter"}
        </button>
      </div>
    </div>
  );
};

const AdminConstants = () => {
  const [ipsets, setIpsets] = useState<ApiRes[]>([]);
  const [osTypes, setOsTypes] = useState<ApiRes[]>([]);
  const [providers, setProviders] = useState<ApiRes[]>([]);
  const [datacenters, setDatacenters] = useState<DatacenterApiRes[]>([]);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const res = await axios.get("/api/admin/system", {
          withCredentials: true,
        });
        if (res?.data) {
          const ipsets = res?.data.filter((item) => item.name === "ipSets");
          setIpsets(ipsets);
          const osTypes = res?.data.filter((item) => item.name === "osType");
          setOsTypes(osTypes);
          const providers = res?.data.filter((item) => item.name === "providers");
          setProviders(providers);
          const datacenters = res?.data.filter((item) => item.name === "datacenter");
          setDatacenters(datacenters);
        }
      } catch (error) {
        toast.error("Failed to fetch system constants");
      }
    };
    fetchSystems();
  }, []);

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h1 className="text-3xl font-bold mb-6">System Constants</h1>

        <Card className="p-6">
          <h2 className="text-2xl font-bold">Datacenters</h2>
          <DatacenterCard data={datacenters} />
          
          <h2 className="text-2xl font-bold mt-6">Ipsets</h2>
          <ListCard
            data={ipsets}
            keyInfo={{
              name: "ipSets",
              header: "IP Set",
              placeholder: "IP Address",
            }}
          />
          
          <h2 className="text-2xl font-bold mt-6">Os Types</h2>
          <ListCard
            data={osTypes}
            keyInfo={{
              name: "osType",
              header: "Os",
              placeholder: "Os Type",
            }}
          />
          
          <h2 className="text-2xl font-bold mt-6">Providers</h2>
          <ListCard
            data={providers}
            keyInfo={{
              name: "providers",
              header: "Provider",
              placeholder: "Provider Name",
            }}
          />
        </Card>
      </div>
    </main>
  );
};

export default AdminConstants;