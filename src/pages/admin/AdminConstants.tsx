import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Pen } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { set } from "date-fns";

interface Key {
  name: string;
  header: string;
  placeholder: string;
}

interface ApiRes {
  _id: string;
  name: string;
  value: string;
  createdAt: Date;
}

interface ListCardProps {
  data: ApiRes[];
  keyInfo: Key;
}

const ListCard: React.FC<ListCardProps> = ({ data, keyInfo }) => {
  const [showmore, setShowmore] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [Data, setData] = useState<ApiRes[]>(data);
  const [loading, setLoading] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    setData(data);
  }, [data]);

  const handleCreate = async () => {
    if(keyInfo?.name === "ipSets") {
      const validIPCharacters = /^[0-9.]*$/;
      if (!validIPCharacters.test(inputValue)) {
        setInputError(true);
        toast.error("Please enter a valid IP Address");
        return;
      } 
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
        setData([...Data, res?.data?.system]);
      }
      toast.success(res?.data?.message || "Created successfully");
    } catch (error) {
      toast.error("Failed to create system.");
    }finally{
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

  const handleDelete = async (id: string) => {
    setLoading(prev=>[...prev, id]);
    try {
      const res = await axios.delete(`/api/admin/delete_system`, {
        params: { id },
        withCredentials: true,
      });
      if (res?.data) {
        toast.success(res?.data?.message || "Deleted successfully");
        const newData = Data.filter((item) => item._id !== id);
        setData(newData);
      }
    } catch (error) {
      toast.error("Failed to delete system.");
    }finally{
      setLoading(prev=>prev.filter(item=>item !== id));
    }
  };

  return (
    <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50 mt-6">
      {Data?.length > 0 ? (
        Data?.slice(0, showmore ? Data.length : 5).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100/50 dark:border-slate-800/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <p className="text-sm text-gray-900 dark:text-slate-100 font-semibold">
                  <span className="text-xs text-gray-500 dark:text-slate-400">{keyInfo.header} {index + 1} </span>  {item?.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                 {/* {keyInfo.placeholder}: {item?.name} */}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {loading.includes(item._id) ? <div className=" text-sm px-4"><Loader className="animate-spin" style={{ width: "1em", height: "1em" }} /></div> : <button className="text-xs text-white border transition-colors duration-200 hover:bg-red-600 py-1 px-2 rounded" onClick={() => handleDelete(item?._id)}>
                Delete
              </button>}
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Created At: {getDate(item.createdAt)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 dark:text-slate-400 w-full text-center">
          No IP Sets found
        </p>
      )}
      {Data?.length > 5 && (
        <div
          className="flex justify-center text-sm mt-4 cursor-pointer hover:text-blue-500 transition-colors duration-200"
          onClick={() => setShowmore(!showmore)}
        >
          {showmore ? "Show Less" : "Show More"}
        </div>
      )}
      <div className="flex gap-5 items-center mt-4">
        <input
          type="text"
          placeholder={inputError ? "Please enter a value before creating" : "Create new IP Set"}
          className={`w-full bg-gray-100 dark:bg-slate-800 p-2  rounded-md ${
            inputError ? "border border-red-500 outline-none" : ""
          }`}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setInputError(false);
          }}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded text-sm flex gap-2 items-center disabled:bg-inherit disabled:border"
          onClick={() => {
            if (inputValue.trim() === "") {
              setInputError(true);
              return;
            } else {
              handleCreate();
            }
          }}
          disabled={createLoading}
        >
          {createLoading ? <Loader className="animate-spin" style={{ width: "1em", height: "1em" }} /> : <Pen style={{ width: ".8em", height: ".8em" }} /> } {" "}{createLoading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
};

const AdminLogs = () => {
  const [ipsets, setIpsets] = useState<ApiRes[]>([]);
  const [osTypes, setOsTypes] = useState<ApiRes[]>([]);
  const [providers, setProviders] = useState<ApiRes[]>([]);

  useEffect(() => {
    const fetchIpSets = async () => {
      try {
        const res:{data:ApiRes[]} = await axios.get("/api/admin/system", {
          withCredentials: true,
        });
        if (res?.data) {
          const ipsets = res?.data.filter((item) => item.name === "ipSets");
          setIpsets(ipsets);
          const osTypes = res?.data.filter((item) => item.name === "osType");
          setOsTypes(osTypes);
          const providers = res?.data.filter((item) => item.name === "providers");
          setProviders(providers);
        }
      } catch (error) {
        toast.error("Failed to fetch ipsets");
      }
    };
    fetchIpSets();
  }, []);

  return (
    <main className="p-6 flex-1">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-100/50">
        <h1 className="text-3xl font-bold mb-6">System Logs</h1>

        <Card className="p-6">
          <h2 className="text-2xl font-bold">Ipsets</h2>
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

export default AdminLogs;
